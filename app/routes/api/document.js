const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const db = require('../../database');
const loginRequired = require('./middlewares/login.required');
const contract = require('../../contract');
const fileHasher = require('../../lib/fileHasher')

router.use(loginRequired);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(process.cwd(), './uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});


router.post('/upload', multer({ storage }).single('file'), async (req, res) => {
    const { file } = req;
    const { doc_type, doc_id, owner } = req.body;
    const { id: user_id } = req.user;
    const docHash = await fileHasher.hash(file.path);

    let owner_address;
    if (owner) {
        const _owner = await db.User.findOne({ where: { username: owner } });
        if (!_owner) return res.status(404).send({ code: 404, message: 'Owner user not found' });
        owner_address = _owner.public_key;
    } else {
        owner_address = req.user.address;
    }

    try {
        console.log('storeDocument:', { doc_id, doc_type, docHash, owner_address, creator: req.user.address });
        await contract.storeDocument(doc_id, doc_type, docHash, owner_address, req.user.address);
        console.log('storeDocument success, verifying fetchMyIds...');
        const verify = await contract.fetchMyIds(req.user.private_key);
        console.log('fetchMyIds after store:', verify);
    } catch (err) {
        console.error('storeDocument error:', err.info?.error?.message || err.message);
        return res.status(500).send({ code: 500, message: err.info?.error?.message || err.message || 'Blockchain error' });
    }

    await db.Document.create({ contentHash: docHash, user_id, path: file.path });
    res.status(201).send();
});

router.get('/list', async (req, res) => {
    console.log('user address from JWT:', req.user.address);
    const docs = await contract.fetchMyIds(req.user.private_key);
    console.log('fetchMyIds for', req.user.username, ':', docs);
    const issuedDocs = [];
    const uploadedDocs = [];
    for (let i = 0; i < docs.length; i++) {
        const doc = await contract.fetchDocumentById(docs[i], req.user.private_key);
        const { docId, docType, contentHash, owner, creator } = doc;
        console.log('doc:', { docId, docType, contentHash, owner, creator, userAddr: req.user.address });
        const _owner = await db.User.findOne({ where: { public_key: owner } });
        const _creator = await db.User.findOne({ where: { public_key: creator } });
        const docInDb = await db.Document.findOne({ where: { contentHash } });
        if (!_owner || !_creator || !docInDb) {
            console.log('skipping doc, missing:', { _owner: !!_owner, _creator: !!_creator, docInDb: !!docInDb });
            continue;
        }
        if (creator.toLowerCase() === req.user.address.toLowerCase()) {
            uploadedDocs.push({
                docId,
                docType,
                contentHash,
                owner: _owner.username,
                creator: _creator.username,
                createdAt: docInDb.createdAt,
                updatedAt: docInDb.updatedAt,
            });
        } else {
            issuedDocs.push({
                docId,
                docType,
                contentHash,
                owner: _owner.username,
                creator: _creator.username,
                createdAt: docInDb.createdAt,
                updatedAt: docInDb.updatedAt,
            });
        }
    };
    res.json({ code: 200, issued_docs:issuedDocs, uploaded_docs:uploadedDocs });
});

router.get('/file/:hash', async (req, res) => {
    const { hash } = req.params;
    const document = await db.Document.findOne({ where: { contentHash: hash } });
    if (!document) {
        return res.status(404).send({ code: 404, message: 'Document not found' });
    }
    res.setHeader('Content-Disposition', `attachment; filename=${path.basename(document.path)}`)
    res.sendFile(document.path);
});

router.post('/edit/:hash', multer({ storage }).single('file'), async (req, res) => {
    const { hash } = req.params;
    const { new_doc_type } = req.body;
    if (!new_doc_type) return res.status(400).send({ code: 400, message: 'new_doc_type is required' });
    if (!req.file) return res.status(400).send({ code: 400, message: 'file is required' });
    const doc = await db.Document.findOne({ where: { contentHash: hash, user_id: req.user.id } });
    if (!doc) {
        return res.status(404).send({ code: 404, message: 'Document not found' });
    }
    const docHash = await fileHasher.hash(req.file.path);
    try {
        await contract.editDocument(hash, new_doc_type, docHash, req.user.private_key);
    } catch (err) {
        return res.status(500).send({ code: 500, message: err.message || 'Blockchain error' });
    }
    await doc.update({ contentHash: docHash, path: req.file.path });
    res.status(200).send();
});


router.post("/share/:hash", multer().any(), async (req, res) => {
    const { hash } = req.params;
    const { username } = req.body;
    console.log(username);
    const doc = await db.Document.findOne({ where: { contentHash: hash, user_id: req.user.id } });
    if (!doc) {
        return res.status(404).send({ code: 404, message: 'Document not found' });
    }

    const user = await db.User.findOne({ where: { username } });
    if (!user) {
        return res.status(404).send({ code: 404, message: 'User not found' });
    }
    
    console.log(hash, user.public_key, req.user.private_key);
    await contract.shareUserAccess(hash, user.public_key, req.user.private_key);
    res.status(200).send();
});

module.exports = router;