# UPI P2P Payment Simulator

A realistic simulation of India's Unified Payments Interface (UPI) architecture, built to understand how distributed payment systems work at scale. This project replicates the core components of the real UPI ecosystem including Payment Service Providers (PSP), NPCI's UPI network layer, and banking services.

## 🎯 Project Purpose

This is a **learning-focused project** designed to understand and simulate real-world UPI payment architecture. It demonstrates critical distributed systems concepts including idempotency, transaction safety, fault tolerance, and secure inter-service communication.

## 🏗️ Architecture Overview

The system consists of three independent microservices that communicate to process peer-to-peer payments:

### 1. **P2P Service (Payer PSP)** - Port 3000
- VPA (Virtual Payment Address) management
- QR code generation and scanning
- Payment initiation and orchestration
- Real-time payment notifications via WebSockets

### 2. **NPCI UPI Network** - Port 3001
- Central switching and routing layer
- Payment request validation
- Coordination between payer and payee banks
- Request deduplication and idempotency management
- Transaction state management

### 3. **Bank Service** - Port 3002
- Account balance management
- Debit/Credit operations
- Beneficiary validation
- Bank-level transaction guarantees

## ✨ Key Features Implemented

### 🔒 Production-Grade Security
- **Hybrid Encryption Model**: AES-256-GCM for data encryption + RSA for key exchange
- Secure inter-service communication mimicking production security practices

### 🔄 Idempotent APIs
- Retry-safe transaction workflows
- Database-level transaction guarantees
- Prevention of double-processing and partial commits
- Idempotency key tracking to handle duplicate requests

### 🎭 Distributed Failure Simulation
- Timeout scenarios
- Network retry logic
- Duplicate request handling
- Compensating transactions for rollback scenarios
- Partial failure recovery mechanisms

### 📊 Real-time Monitoring
- WebSocket-based real-time latency tracking
- Success/failure metrics under load
- Load testing using k6
- Transaction state visualization

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (separate databases per service on shared server)
- **Real-time Communication**: WebSockets
- **Load Testing**: k6
- **Encryption**: 
  - AES-256-GCM (symmetric encryption)
  - RSA (asymmetric key exchange)

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn
- k6 (optional, for load testing)

## 🚀 Getting Started

### 1. Clone the Repositories

```bash
# Clone P2P Service
git clone [github-link-for-p2p-service]

# Clone NPCI Service
git clone [github-link-for-npci-service]

# Clone Bank Service
git clone [github-link-for-bank-service]
```

### 2. Database Setup

Create three separate databases in PostgreSQL:

```sql
CREATE DATABASE p2p_service;
CREATE DATABASE npci_service;
CREATE DATABASE bank_service;
```

Run migration scripts in each service directory (if provided):

```bash
# In each service directory
npm run migrate
# or
node migrations/setup.js
```

### 3. Install Dependencies

```bash
# In each service directory
npm install
```

### 4. Configure Environment Variables

Create `.env` files in each service directory:

**P2P Service (.env)**
```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/p2p_service
NPCI_SERVICE_URL=http://localhost:3001
RSA_PRIVATE_KEY_PATH=./keys/private.pem
RSA_PUBLIC_KEY_PATH=./keys/public.pem
```

**NPCI Service (.env)**
```env
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/npci_service
BANK_SERVICE_URL=http://localhost:3002
P2P_SERVICE_URL=http://localhost:3000
RSA_PRIVATE_KEY_PATH=./keys/private.pem
RSA_PUBLIC_KEY_PATH=./keys/public.pem
```

**Bank Service (.env)**
```env
PORT=3002
DATABASE_URL=postgresql://user:password@localhost:5432/bank_service
NPCI_SERVICE_URL=http://localhost:3001
RSA_PRIVATE_KEY_PATH=./keys/private.pem
RSA_PUBLIC_KEY_PATH=./keys/public.pem
```

### 5. Generate RSA Key Pairs

```bash
# In each service directory
npm run generate-keys
# or manually generate using openssl
openssl genrsa -out keys/private.pem 2048
openssl rsa -in keys/private.pem -pubout -out keys/public.pem
```

### 6. Start Services

Start each service in a separate terminal:

```bash
# Terminal 1 - Bank Service (start first)
cd bank-service
npm start

# Terminal 2 - NPCI Service
cd npci-service
npm start

# Terminal 3 - P2P Service
cd p2p-service
npm start
```

## 🧪 Testing the System

### Sample Test Flow

1. **Create VPA**
```bash
POST http://localhost:3000/api/vpa/create
{
  "userId": "user123",
  "vpa": "user@paytm"
}
```

2. **Initiate Payment**
```bash
POST http://localhost:3000/api/payment/initiate
{
  "payerVPA": "user@paytm",
  "payeeVPA": "merchant@phonepe",
  "amount": 500,
  "mpin": "1234"
}
```

3. **Monitor via WebSocket**
```javascript
const socket = io('http://localhost:3000');
socket.on('payment-status', (data) => {
  console.log('Payment Status:', data);
});
```

### Load Testing with k6

```bash
k6 run load-tests/payment-flow.js
```

## 🎓 What I Learned

### Distributed Systems Challenges

**1. Partial Failures**
- Services can fail independently in a distributed system
- Network partitions can cause inconsistent states
- Implemented compensating transactions to handle rollback scenarios
- Used database transactions to ensure atomicity within service boundaries

**2. Idempotency & Retry Safety**
- Same request can arrive multiple times due to network issues
- Implemented idempotency keys to track and deduplicate requests
- Ensured APIs are safe to retry without causing duplicate charges
- Used unique transaction IDs to prevent double-processing

**3. Error Propagation & Handling**
- Errors must be properly propagated across service boundaries
- Implemented circuit breaker patterns for cascading failure prevention
- Used compensating logic to maintain consistency during failures
- Timeout handling to prevent indefinite waiting states

**4. Consistency vs Availability Trade-offs**
- Understood CAP theorem in practice
- Implemented eventual consistency where appropriate
- Used database-level locks for critical sections
- Balanced between strong consistency and system availability

**5. Security in Distributed Systems**
- Secure communication between services is critical
- Implemented hybrid encryption (symmetric + asymmetric)
- Key management and rotation strategies
- Protection against man-in-the-middle attacks

**6. Observability & Monitoring**
- Real-time monitoring is essential in distributed systems
- WebSocket-based live metrics for debugging
- Transaction tracing across service boundaries
- Performance monitoring under load conditions

## 📊 System Flow

### Complete Payment Flow

1. **Customer initiates payment** via mobile app (P2P PSP)
2. **P2P Service** validates MPIN and creates payment request
3. **NPCI receives payment request** and validates
4. **NPCI sends debit request** to Remitter/Issuer Bank
5. **Bank validates** and debits payer's account
6. **Bank responds** to NPCI with debit confirmation
7. **NPCI sends credit request** to Beneficiary Bank
8. **Beneficiary Bank credits** payee's account
9. **NPCI updates** payment status
10. **P2P Service receives** final status
11. **Customer gets notification** via WebSocket

## 🔐 Security Features

- **End-to-End Encryption**: All inter-service communication is encrypted
- **RSA Key Exchange**: Secure exchange of AES symmetric keys
- **AES-256-GCM**: Fast symmetric encryption for payload data
- **Request Signing**: Prevents tampering of requests in transit

## 🚧 Known Limitations

- This is a simulator and not production-ready
- Does not implement all UPI specifications
- Simplified banking operations (no actual bank integration)
- Limited fraud detection mechanisms
- No regulatory compliance implementations

## 🔮 Future Enhancements

- [ ] Add support for QR code-based payments
- [ ] Implement mandate/autopay features
- [ ] Add transaction dispute resolution
- [ ] Implement rate limiting and throttling
- [ ] Add comprehensive audit logging
- [ ] Support for international payments

## 📚 References & Learning Resources

- [NPCI UPI Specification](https://www.npci.org.in/what-we-do/upi/product-overview)
- [Distributed Systems Patterns](https://martinfowler.com/articles/patterns-of-distributed-systems/)
- [Idempotency in Payment Systems](https://stripe.com/docs/api/idempotent_requests)
- [Database Transaction Isolation Levels](https://www.postgresql.org/docs/current/transaction-iso.html)

## 📄 License

MIT License - Feel free to use this project for learning purposes.

**Note**: This is a simulation project built for educational purposes. It demonstrates concepts of distributed payment systems but should not be used in production environments without significant security hardening and compliance implementations.


For questions or discussions about this project, feel free to reach out via GitHub issues.

---

⭐ If you found this project helpful for learning, please star the repositories!
