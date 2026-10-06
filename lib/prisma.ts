generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  CUSTOMER
  PROVIDER
  ADMIN
}

enum CategoryType {
  SERVICES
  PROPERTIES
  VEHICLES
}

enum ListingStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
  HIDDEN
}

enum PricingType {
  FIXED
  HOURLY
  DAILY
  STARTING_FROM
  CUSTOM_QUOTE
}

enum PropertyTransactionType {
  SALE
  RENT
}

enum VehicleCondition {
  NEW
  USED
  CERTIFIED
}

enum ServiceRequestStatus {
  OPEN
  QUOTED
  ACCEPTED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum QuoteStatus {
  DRAFT
  SENT
  ACCEPTED
  REJECTED
  EXPIRED
  CANCELLED
}

enum OrderStatus {
  REQUESTED
  QUOTED
  ACCEPTED
  PAYMENT_PENDING
  PAYMENT_CONFIRMED
  SCHEDULED
  IN_PROGRESS
  COMPLETED
  CUSTOMER_CONFIRMED
  PAYOUT_PENDING
  PAID
  CANCELLED
  DISPUTED
  REFUNDED
}

enum PaymentStatus {
  PENDING
  PROCESSING
  SUCCEEDED
  FAILED
  CANCELLED
  REQUIRES_ACTION
}

enum TransactionType {
  CHARGE
  REFUND
  PAYOUT
  COMMISSION
}

enum PayoutStatus {
  PENDING
  PROCESSING
  PAID
  FAILED
}

enum RefundStatus {
  REQUESTED
  PROCESSING
  APPROVED
  REJECTED
  COMPLETED
}

enum DisputeStatus {
  OPEN
  UNDER_REVIEW
  RESOLVED
  CLOSED
}

enum NotificationType {
  NEW_REQUEST
  NEW_QUOTE
  QUOTE_ACCEPTED
  QUOTE_REJECTED
  PAYMENT_RECEIVED
  ORDER_UPDATE
  NEW_MESSAGE
  REVIEW
  REFUND
  DISPUTE
  VERIFICATION_RESULT
}

enum ReviewStatus {
  PENDING
  APPROVED
  REJECTED
}

enum VerificationStatus {
  PENDING
  VERIFIED
  REJECTED
  FLAGGED
}

model User {
  id                 String            @id @default(cuid())
  email              String            @unique
  name               String?
  passwordHash       String?
  role               Role              @default(CUSTOMER)
  emailVerifiedAt    DateTime?
  createdAt          DateTime          @default(now())
  updatedAt          DateTime          @updatedAt

  customerProfile    CustomerProfile?
  providerProfile    ProviderProfile?
  addresses          Address[]
  favorites          Favorite[]
  serviceRequests    ServiceRequest[]
  quotes             Quote[]           @relation("ProviderQuotes")
  customerOrders     Order[]           @relation("CustomerOrders")
  providerOrders     Order[]           @relation("ProviderOrders")
  paymentsSent       Payment[]         @relation("PaymentsSent")
  paymentsReceived   Payment[]         @relation("PaymentsReceived")
  payouts            Payout[]
  refunds            Refund[]
  disputes           Dispute[]
  sentMessages       Message[]         @relation("SentMessages")
  notifications      Notification[]
  reviewsWritten     Review[]          @relation("ReviewsWritten")
  reviewsReceived    Review[]          @relation("ReviewsReceived")
  conversationsAsCustomer Conversation[] @relation("CustomerConversations")
  conversationsAsProvider Conversation[] @relation("ProviderConversations")
  transactions       Transaction[]
  auditLogs          AuditLog[]        @relation("UserAuditLogs")
  availabilities     Availability[]
}

model CustomerProfile {
  id            String   @id @default(cuid())
  userId        String   @unique
  displayName   String?
  phone         String?
  avatarUrl     String?
  bio           String?
  defaultAddressId String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model ProviderProfile {
  id              String             @id @default(cuid())
  userId          String             @unique
  businessName    String
  slug            String             @unique
  phone           String?
  avatarUrl       String?
  bio             String?
  location        String?
  serviceArea     String?
  experienceYears Int?
  responseRate    Int?
  completedJobs   Int                @default(0)
  rating          Decimal?           @db.Decimal(3, 2)
  verified        Boolean            @default(false)
  verificationStatus VerificationStatus @default(PENDING)
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt

  user            User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  listings        Listing[]
  verifications   Verification[]
  reviews         Review[]          @relation("ProviderReviews")
  payouts         Payout[]
  availabilities  Availability[]
  conversations   Conversation[]    @relation("ProviderConversations")
}

model Address {
  id          String    @id @default(cuid())
  userId      String
  line1       String
  line2       String?
  city        String
  state       String?
  country     String
  postalCode  String?
  latitude    Float?
  longitude   Float?
  isDefault   Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model Category {
  id        String        @id @default(cuid())
  name      String        @unique
  slug      String        @unique
  type      CategoryType
  parentId  String?
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt

  parent    Category?     @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children  Category[]    @relation("CategoryHierarchy")
  listings  Listing[]
}

model Listing {
  id          String        @id @default(cuid())
  categoryId  String
  providerId  String
  title       String
  slug        String        @unique
  description String        @db.Text
  status      ListingStatus @default(PUBLISHED)
  priceCents  Int
  currency    String        @default("USD")
  location    String
  serviceArea String?
  tags        String[]
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  category    Category      @relation(fields: [categoryId], references: [id], onDelete: Restrict)
  provider    ProviderProfile @relation(fields: [providerId], references: [id], onDelete: Restrict)
  images      ListingImage[]
  serviceListing ServiceListing?
  propertyListing PropertyListing?
  vehicleListing VehicleListing?
  favorites   Favorite[]
  orders      Order[]

  @@index([categoryId])
  @@index([providerId])
  @@index([status])
  @@index([location])
}

model ListingImage {
  id        String   @id @default(cuid())
  listingId String
  url       String
  caption   String?
  sortOrder Int      @default(0)
  createdAt DateTime @default(now())

  listing   Listing  @relation(fields: [listingId], references: [id], onDelete: Cascade)

  @@index([listingId])
}

model ServiceListing {
  id             String       @id @default(cuid())
  listingId      String       @unique
  subcategory    String?
  pricingType    PricingType  @default(FIXED)
  availability   String?
  experience     String?
  rating         Decimal?     @db.Decimal(3, 2)
  reviewCount    Int          @default(0)
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  listing        Listing      @relation(fields: [listingId], references: [id], onDelete: Cascade)
}

model PropertyListing {
  id               String                  @id @default(cuid())
  listingId        String                  @unique
  propertyType     String
  transactionType  PropertyTransactionType @default(SALE)
  bedrooms         Int?
  bathrooms        Int?
  squareFeet       Int?
  amenities        String[]
  availability     String?
  createdAt        DateTime                @default(now())
  updatedAt        DateTime                @updatedAt

  listing          Listing                 @relation(fields: [listingId], references: [id], onDelete: Cascade)
}

model VehicleListing {
  id            String           @id @default(cuid())
  listingId     String           @unique
  make          String
  model         String
  year          Int
  mileage       Int?
  condition     VehicleCondition @default(USED)
  transmission  String?
  fuelType      String?
  bodyType      String?
  color         String?
  createdAt     DateTime         @default(now())
  updatedAt     DateTime         @updatedAt

  listing       Listing          @relation(fields: [listingId], references: [id], onDelete: Cascade)
}

model Favorite {
  id        String   @id @default(cuid())
  userId    String
  listingId String?
  providerId String?
  targetType String
  targetId   String
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  listing   Listing? @relation(fields: [listingId], references: [id], onDelete: Cascade)

  @@unique([userId, targetType, targetId], map: "favorite_user_target_unique")
  @@index([userId])
}

model ServiceRequest {
  id          String               @id @default(cuid())
  customerId  String
  categoryId  String?
  title       String
  description String              @db.Text
  date        DateTime?
  startTime   String?
  endTime     String?
  location    String?
  budgetCents Int?
  attachments String[]
  status      ServiceRequestStatus @default(OPEN)
  createdAt   DateTime             @default(now())
  updatedAt   DateTime             @updatedAt

  customer    User                 @relation(fields: [customerId], references: [id], onDelete: Restrict)
  quotes      Quote[]
  orders      Order[]

  @@index([customerId])
  @@index([status])
}

model Quote {
  id                String      @id @default(cuid())
  requestId         String
  providerId        String
  customerId        String
  priceCents        Int
  description       String      @db.Text
  estimatedDuration String?
  expirationDate    DateTime?
  terms             String?
  status            QuoteStatus @default(SENT)
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt

  request           ServiceRequest @relation(fields: [requestId], references: [id], onDelete: Restrict)
  provider          User          @relation("ProviderQuotes", fields: [providerId], references: [id], onDelete: Restrict)
  customer          User          @relation(fields: [customerId], references: [id], onDelete: Restrict)
  order             Order?

  @@index([requestId])
  @@index([providerId])
  @@index([status])
}

model Order {
  id                    String         @id @default(cuid())
  quoteId               String?        @unique
  requestId             String?
  customerId            String
  providerId            String
  listingId             String?
  totalCents            Int
  commissionAmountCents Int            @default(0)
  payoutAmountCents     Int            @default(0)
  currency              String         @default("USD")
  status                OrderStatus    @default(REQUESTED)
  createdAt             DateTime       @default(now())
  updatedAt             DateTime       @updatedAt

  quote                 Quote?         @relation(fields: [quoteId], references: [id], onDelete: SetNull)
  request               ServiceRequest? @relation(fields: [requestId], references: [id], onDelete: SetNull)
  customer              User           @relation("CustomerOrders", fields: [customerId], references: [id], onDelete: Restrict)
  provider              User           @relation("ProviderOrders", fields: [providerId], references: [id], onDelete: Restrict)
  listing               Listing?       @relation(fields: [listingId], references: [id], onDelete: SetNull)
  statusHistory         OrderStatusHistory[]
  payments              Payment[]
  payouts               Payout[]
  refunds               Refund[]
  disputes              Dispute[]
  reviews               Review[]

  @@index([customerId])
  @@index([providerId])
  @@index([status])
}

model OrderStatusHistory {
  id        String      @id @default(cuid())
  orderId   String
  status    OrderStatus
  note      String?
  createdAt DateTime    @default(now())

  order     Order       @relation(fields: [orderId], references: [id], onDelete: Cascade)

  @@index([orderId])
}

model Payment {
  id                String        @id @default(cuid())
  orderId           String
  payerId           String
  payeeId           String
  amountCents       Int
  currency          String        @default("USD")
  status            PaymentStatus @default(PENDING)
  providerPaymentId String?
  webhookEventId    String?
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt

  order             Order         @relation(fields: [orderId], references: [id], onDelete: Restrict)
  payer             User          @relation("PaymentsSent", fields: [payerId], references: [id], onDelete: Restrict)
  payee             User          @relation("PaymentsReceived", fields: [payeeId], references: [id], onDelete: Restrict)
  transactions      Transaction[]

  @@index([orderId])
  @@index([status])
}

model Transaction {
  id          String          @id @default(cuid())
  paymentId   String?
  orderId     String?
  userId      String
  type        TransactionType
  amountCents Int
  currency    String          @default("USD")
  status      PaymentStatus   @default(PENDING)
  note        String?
  createdAt   DateTime        @default(now())

  payment     Payment?        @relation(fields: [paymentId], references: [id], onDelete: SetNull)
  user        User            @relation(fields: [userId], references: [id], onDelete: Restrict)

  @@index([userId])
  @@index([paymentId])
}

model Payout {
  id             String      @id @default(cuid())
  providerId     String
  orderId        String?
  amountCents    Int
  status         PayoutStatus @default(PENDING)
  scheduledAt    DateTime?
  processedAt    DateTime?
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt

  provider       User        @relation(fields: [providerId], references: [id], onDelete: Restrict)
  order          Order?      @relation(fields: [orderId], references: [id], onDelete: SetNull)

  @@index([providerId])
  @@index([status])
}

model Refund {
  id        String      @id @default(cuid())
  orderId   String
  userId    String
  amountCents Int
  reason    String      @db.Text
  status    RefundStatus @default(REQUESTED)
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt

  order     Order       @relation(fields: [orderId], references: [id], onDelete: Restrict)
  user      User        @relation(fields: [userId], references: [id], onDelete: Restrict)

  @@index([orderId])
}

model Dispute {
  id        String       @id @default(cuid())
  orderId   String
  userId    String
  reason    String       @db.Text
  status    DisputeStatus @default(OPEN)
  createdAt DateTime     @default(now())
  updatedAt DateTime     @updatedAt

  order     Order        @relation(fields: [orderId], references: [id], onDelete: Restrict)
  user      User         @relation(fields: [userId], references: [id], onDelete: Restrict)

  @@index([orderId])
}

model Review {
  id         String      @id @default(cuid())
  orderId    String
  customerId String
  providerId String
  rating     Int
  comment    String?     @db.Text
  status     ReviewStatus @default(PENDING)
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt

  order      Order       @relation(fields: [orderId], references: [id], onDelete: Restrict)
  customer   User        @relation("ReviewsWritten", fields: [customerId], references: [id], onDelete: Restrict)
  provider   ProviderProfile @relation("ProviderReviews", fields: [providerId], references: [id], onDelete: Restrict)

  @@unique([orderId])
  @@index([providerId])
}

model Conversation {
  id          String    @id @default(cuid())
  customerId  String
  providerId  String
  listingId   String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  customer    User      @relation("CustomerConversations", fields: [customerId], references: [id], onDelete: Restrict)
  provider    User      @relation("ProviderConversations", fields: [providerId], references: [id], onDelete: Restrict)
  providerProfile ProviderProfile? @relation("ProviderConversations", fields: [providerId], references: [id], onDelete: Restrict)
  messages    Message[]

  @@index([customerId])
  @@index([providerId])
}

model Message {
  id            String      @id @default(cuid())
  conversationId String
  senderId      String
  content       String      @db.Text
  attachments   Json?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  conversation  Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  sender        User         @relation("SentMessages", fields: [senderId], references: [id], onDelete: Restrict)

  @@index([conversationId])
  @@index([senderId])
}

model Notification {
  id        String          @id @default(cuid())
  userId    String
  type      NotificationType
  title     String
  body      String
  data      Json?
  readAt    DateTime?
  createdAt DateTime        @default(now())
  updatedAt DateTime        @updatedAt

  user      User            @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([readAt])
}

model Verification {
  id            String             @id @default(cuid())
  providerId    String
  status        VerificationStatus @default(PENDING)
  notes         String?
  documentUrl   String?
  reviewedBy    String?
  createdAt     DateTime           @default(now())
  updatedAt     DateTime           @updatedAt

  provider      ProviderProfile    @relation(fields: [providerId], references: [id], onDelete: Cascade)

  @@index([providerId])
}

model Availability {
  id            String   @id @default(cuid())
  providerId    String
  dayOfWeek     Int?
  startTime     String?
  endTime       String?
  date          DateTime?
  isUnavailable Boolean @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  provider      User     @relation(fields: [providerId], references: [id], onDelete: Cascade)

  @@index([providerId])
}

model AuditLog {
  id          String   @id @default(cuid())
  actorId     String?
  action      String
  entityType  String
  entityId    String
  metadata    Json?
  createdAt   DateTime @default(now())

  actor       User?    @relation("UserAuditLogs", fields: [actorId], references: [id], onDelete: SetNull)

  @@index([actorId])
  @@index([entityType])
}
