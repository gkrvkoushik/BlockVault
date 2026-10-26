        # Blockchain eVault — Application Workflow

        ## Table of Contents
        - [System Architecture](#system-architecture)
        - [Startup Workflow](#startup-workflow)
        - [User Workflows](#user-workflows)
        - [Signup](#1-signup)
        - [Login](#2-login)
        - [Upload Document](#3-upload-document)
        - [View Documents](#4-view-documents)
        - [Edit Document](#5-edit-document)
        - [Share Document](#6-share-document)
        - [Download Document](#7-download-document)
        - [Role Management](#role-management)
        - [Data Flow Diagram](#data-flow-diagram)
        - [Important Notes](#important-notes)

        ---

        ## System Architecture

        ```
        Browser (React + Vite)          Backend (Node.js + Express)         Blockchain (Ganache)
        :5173              <──────>        :3001              <──────>      :8545
                                                │
                                        SQLite DB
                                        (database.sqlite)
                                        /uploads/
        ```

        Three layers work together:
        - **Frontend** — React UI running on port 5173
        - **Backend** — Express REST API running on port 3001, handles auth, file storage, and blockchain calls
        - **Blockchain** — Ganache local Ethereum node on port 8545, stores document hashes and user registry via the `DocumentRegistry` smart contract

        ---

        ## Startup Workflow

        Every time you start the project from scratch (or after Ganache restarts):

        ```
        1. Start Ganache
        └── ganache
        └── Blockchain resets, all on-chain data is wiped

        2. Deploy Smart Contract (Remix IDE)
        └── Environment: Custom External HTTP → http://127.0.0.1:8545
        └── EVM Version: london
        └── Deploy engine.sol
        └── Copy deployed contract address

        3. Update config.toml
        └── contract.address    = <new deployed address>
        └── contract.owner_address    = <Remix deployer account address>
        └── contract.owner_private_key = <Remix deployer account private key>

        4. Delete stale database (if exists)
        └── del database.sqlite

        5. Start Backend
        └── npm start → http://localhost:3001
        └── SQLite database auto-created on first run

        6. Start Frontend
        └── cd web && npm run dev → http://localhost:5173
        ```

        > Ganache resets the blockchain on every restart. Always delete `database.sqlite` and re-signup after restarting Ganache.

        ---

        ## User Workflows

        ### 1. Signup

        **URL:** `http://localhost:5173/signup`

        **What happens step by step:**

        ```
        User fills form (username, name, email, password)
                │
                ▼
        POST /api/signup
                │
                ├── Validate fields (signup.validate.js middleware)
                │
                ├── Check if username or email already exists in SQLite
                │
                ├── Hash password with bcrypt (10 rounds)
                │
                ├── Generate new Ethereum wallet (ethers.Wallet.createRandom)
                │   └── Returns: { privateKey, address }
                │
                ├── Call contract.createUser(username, walletAddress)
                │   └── Admin wallet signs the transaction
                │   └── Smart contract registers the wallet address on-chain
                │   └── If this fails → return 500, do NOT save to DB
                │
                └── Save user to SQLite (username, name, email, password_hash, private_key, public_key)
                        │
                        ▼
                200 OK → redirect to /login
        ```

        **Key points:**
        - Every user gets a unique Ethereum wallet auto-generated at signup
        - The wallet is registered on the smart contract by the admin (deployer account)
        - If blockchain registration fails, the user is NOT saved to the database (atomic)

        ---

        ### 2. Login

        **URL:** `http://localhost:5173/login`

        **What happens step by step:**

        ```
        User enters email/username + password
                │
                ▼
        POST /api/login
                │
                ├── Validate fields (login.validate.js middleware)
                │
                ├── Find user by email or username in SQLite
                │
                ├── Compare password with bcrypt hash
                │
                └── Sign JWT token containing:
                { id, username, email, address, private_key }
                        │
                        ▼
                Return { token }
                        │
                        ▼
                Frontend stores token in localStorage
                        │
                        ▼
                Redirect to /dash (Dashboard)
        ```

        **Key points:**
        - JWT token contains the user's Ethereum wallet private key (used to sign blockchain transactions)
        - Token expires in 7 days (configurable in `config.toml`)
        - Login accepts both email and username in the email field

        ---

        ### 3. Upload Document

        **URL:** Dashboard → "Upload Document" button

        **What happens step by step:**

        ```
        User selects file + fills Document ID, Document Type, Owner (optional)
                │
                ▼
        POST /api/doc/upload  (multipart/form-data)
        Authorization: Bearer <token>
                │
                ├── loginRequired middleware → verify JWT → attach user to req.user
                │
                ├── Multer saves file to /uploads/<timestamp>-<filename>
                │
                ├── Hash file with SHA256 (fileHasher.js)
                │   └── contentHash = SHA256(file bytes)
                │
                ├── Resolve owner address:
                │   ├── If owner username provided → lookup public_key from SQLite
                │   └── If no owner → use req.user.address (uploader is owner)
                │
                ├── Call contract.storeDocument(docId, docType, contentHash, ownerAddress, creatorAddress)
                │   └── Admin wallet signs the transaction
                │   └── Smart contract stores document on-chain
                │   └── If this fails → return 500, file stays on disk but NOT in DB
                │
                └── Save document record to SQLite (contentHash, user_id, path)
                        │
                        ▼
                201 Created
        ```

        **Key points:**
        - The file is stored physically in `/uploads/` on the server
        - Only the SHA256 hash is stored on the blockchain (not the file itself)
        - `owner` = who owns the document, `creator` = who uploaded it (can be different)
        - Blockchain call happens before DB save — if blockchain fails, no orphan DB record

        ---

        ### 4. View Documents

        **URL:** Dashboard → document list (auto-loaded)

        **What happens step by step:**

        ```
        GET /api/doc/list
        Authorization: Bearer <token>
                │
                ├── loginRequired middleware → verify JWT
                │
                ├── Call contract.fetchMyIds(userPrivateKey)
                │   └── User's wallet signs the call
                │   └── Returns array of contentHashes the user has access to
                │
                ├── For each contentHash:
                │   ├── contract.fetchDocumentById(hash, userPrivateKey)
                │   │   └── Returns: { docId, docType, contentHash, owner, creator }
                │   │
                │   ├── Lookup owner username from SQLite by public_key
                │   ├── Lookup creator username from SQLite by public_key
                │   ├── Lookup file metadata from SQLite by contentHash
                │   └── Skip if any lookup returns null (safety guard)
                │
                └── Split into two lists:
                ├── uploaded_docs → where creator == req.user.address
                └── issued_docs   → where creator != req.user.address (shared with you)
                        │
                        ▼
                { issued_docs: [...], uploaded_docs: [...] }
        ```

        **Dashboard stats:**
        - Total Documents = issued + uploaded count
        - Issued Documents = documents shared with you by others
        - Uploaded Documents = documents you uploaded

        ---

        ### 5. Edit Document

        **URL:** Dashboard → document card → Edit button

        **What happens step by step:**

        ```
        User selects new file + enters new Document Type
                │
                ▼
        POST /api/doc/edit/:hash  (multipart/form-data)
        Authorization: Bearer <token>
                │
                ├── loginRequired middleware → verify JWT
                │
                ├── Find document in SQLite by contentHash AND user_id
                │   └── If not found → 404
                │
                ├── Validate new_doc_type and file are present
                │
                ├── Multer saves new file to /uploads/
                │
                ├── Hash new file with SHA256 → newContentHash
                │
                ├── Call contract.editDocument(oldHash, newDocType, newHash, userPrivateKey)
                │   └── User's OWN wallet signs the transaction (not admin)
                │   └── Smart contract checks msg.sender == doc.owner
                │   └── Updates docType and contentHash on-chain
                │   └── If this fails → return 500
                │
                └── Update SQLite record (contentHash → newHash, path → new file path)
                        │
                        ▼
                200 OK
        ```

        **Key points:**
        - Only the document **owner** can edit (enforced by smart contract)
        - The transaction is signed by the user's wallet (not admin)
        - Both the on-chain hash and the SQLite record are updated

        ---

        ### 6. Share Document

        **URL:** Dashboard → document card → Share button

        **What happens step by step:**

        ```
        User enters recipient username
                │
                ▼
        POST /api/doc/share/:hash
        Authorization: Bearer <token>
                │
                ├── loginRequired middleware → verify JWT
                │
                ├── Find document in SQLite by contentHash AND user_id
                │   └── If not found → 404
                │
                ├── Find recipient user in SQLite by username
                │   └── If not found → 404
                │
                ├── Call contract.shareUserAccess(hash, recipientWalletAddress, senderPrivateKey)
                │   └── Sender's OWN wallet signs the transaction
                │   └── Smart contract checks:
                │       ├── Recipient is a registered user
                │       ├── Document exists
                │       └── msg.sender == doc.owner
                │   └── Adds contentHash to recipient's document list on-chain
                │
                └── 200 OK
        ```

        **Key points:**
        - Only the document **owner** can share (enforced by smart contract)
        - Sharing grants the recipient read access via their wallet address on-chain
        - The shared document appears in the recipient's `issued_docs` list

        ---

        ### 7. Download Document

        **URL:** Dashboard → document card → Download button

        **What happens step by step:**

        ```
        GET /api/doc/file/:hash
        Authorization: Bearer <token>
                │
                ├── loginRequired middleware → verify JWT
                │
                ├── Find document in SQLite by contentHash AND user_id
                │   └── If not found → 404
                │
                └── Stream file from disk path stored in SQLite
                └── Content-Disposition: attachment; filename=<original filename>
                        │
                        ▼
                File download in browser
        ```

        ---

        ## Role Management

        Roles are managed by the admin directly via the smart contract. There is no UI for this — it must be done via Remix IDE or a script.

        | Role | Description | How to assign |
        |---|---|---|
        | `User` | Default role on signup | Automatic |
        | `Lawyer` | Legal professional | Admin calls `grantRole(address, "Lawyer")` |
        | `Judge` | Judicial authority | Admin calls `grantRole(address, "Judge")` |

        **To grant a role via Remix:**
        1. Open Remix → Load deployed contract
        2. Call `grantRole` with the user's wallet address and role string
        3. The user's `verified` flag is also set to `true`

        ---

        ## Data Flow Diagram

        ```
                                ┌─────────────────────────────────┐
                                │         Smart Contract           │
                                │  (DocumentRegistry on Ganache)   │
                                │                                  │
                                │  users mapping                   │
                                │  documents mapping               │
                                │  documentsCreatedByUser mapping  │
                                └──────────────┬──────────────────┘
                                        │ ethers.js
                                        │
        ┌──────────────┐    HTTP    ┌──────────┴──────────┐    File I/O    ┌──────────────┐
        │   Browser    │ ◄────────► │   Express Backend   │ ◄────────────► │  /uploads/   │
        │  React App   │            │                     │                │  (disk)      │
        │  :5173       │            │  JWT Auth           │                └──────────────┘
        └──────────────┘            │  Multer             │
                                │  bcrypt             │    Sequelize   ┌──────────────┐
                                │  Routes             │ ◄────────────► │  SQLite DB   │
                                └─────────────────────┘                │  users       │
                                                                        │  documents   │
                                                                        └──────────────┘
        ```

        ---

        ## Important Notes

        ### Ganache Reset Rule
        Every time Ganache is restarted, the blockchain is wiped. You must:
        1. Redeploy the contract in Remix (EVM version: `london`)
        2. Update `config.toml` with the new contract address
        3. Delete `database.sqlite`
        4. Clear browser `localStorage` (`localStorage.clear()` in browser console)
        5. Sign up again → login → use the app

        ### Two Sources of Truth
        The app maintains data in two places that must stay in sync:

        | Data | Stored In |
        |---|---|
        | Document hash, owner, creator, access control | Blockchain (permanent per session) |
        | File path, user credentials, wallet keys | SQLite (persists across restarts) |

        If either is reset without the other, the app will fail with errors like `"Owner doesn't exist"` or foreign key constraint errors.

        ### Who Signs What
        | Action | Signed By |
        |---|---|
        | `createUser` | Admin wallet (owner in config.toml) |
        | `storeDocument` | Admin wallet |
        | `fetchMyIds` | User's own wallet |
        | `fetchDocumentById` | User's own wallet |
        | `editDocument` | User's own wallet |
        | `shareUserAccess` | User's own wallet |
