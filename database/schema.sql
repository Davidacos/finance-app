-- ============================================================
-- finance_app — MySQL Schema (Production Ready)
-- ============================================================
-- Conventions:
--   · All PKs are CHAR(36) UUIDs generated in the application layer
--   · Monetary amounts use DECIMAL(12,2) — never FLOAT/DOUBLE
--   · All tables include created_at / updated_at audit columns
--   · InnoDB for FK + ACID support
-- ============================================================

DROP DATABASE IF EXISTS finance_app;
CREATE DATABASE finance_app
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE finance_app;

-- ------------------------------------------------------------
-- 1. users
-- ------------------------------------------------------------
CREATE TABLE users (
  id            CHAR(36)     NOT NULL,
  email         VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name    VARCHAR(100)          DEFAULT NULL,
  last_name     VARCHAR(100)          DEFAULT NULL,
  currency_code CHAR(3)      NOT NULL DEFAULT 'USD',
  language      CHAR(5)      NOT NULL DEFAULT 'es',
  monthly_budget DECIMAL(12,2)        DEFAULT 0.00,
  is_active     TINYINT(1)   NOT NULL DEFAULT 1,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
                                      ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB;


-- ------------------------------------------------------------
-- 2. categories
-- ------------------------------------------------------------
-- Rationale: categories are per-user so each user can customise
-- them without affecting others (multi-tenant ready).
-- type ENUM enforces the income/expense split at the DB level.
-- ------------------------------------------------------------
CREATE TABLE categories (
  id         CHAR(36)              NOT NULL,
  user_id    CHAR(36)              NOT NULL,
  name       VARCHAR(100)          NOT NULL,
  type       ENUM('income','expense') NOT NULL,
  icon       VARCHAR(50)                    DEFAULT NULL,  -- emoji or icon key
  color      CHAR(7)                        DEFAULT NULL,  -- hex color #RRGGBB
  is_default TINYINT(1)            NOT NULL DEFAULT 0,     -- seeded defaults
  created_at DATETIME              NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME              NOT NULL DEFAULT CURRENT_TIMESTAMP
                                            ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_categories_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Fast look-up by user + type (dashboard filters)
CREATE INDEX idx_cat_user_type ON categories(user_id, type);


-- ------------------------------------------------------------
-- 3. transactions
-- ------------------------------------------------------------
-- Rationale:
--   · ON DELETE RESTRICT on category_id avoids orphaned money
--     records if a category is accidentally deleted.
--   · transaction_date (DATE) split from created_at (DATETIME)
--     lets users back-date entries (e.g. forgot to log yesterday).
--   · type is denormalised here on purpose: allows direct GROUP BY
--     without a JOIN to categories → faster monthly reports.
-- ------------------------------------------------------------
CREATE TABLE transactions (
  id               CHAR(36)                 NOT NULL,
  user_id          CHAR(36)                 NOT NULL,
  category_id      CHAR(36)                 NOT NULL,
  type             ENUM('income','expense')  NOT NULL,
  amount           DECIMAL(12,2)            NOT NULL,
  description      VARCHAR(255)                      DEFAULT NULL,
  transaction_date DATE                     NOT NULL,
  payment_method   ENUM(
                     'cash','credit_card','debit_card',
                     'bank_transfer','other'
                   )                        NOT NULL DEFAULT 'cash',
  created_at       DATETIME                 NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME                 NOT NULL DEFAULT CURRENT_TIMESTAMP
                                                     ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_tx_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_tx_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Primary report index: filter by user + month range
CREATE INDEX idx_tx_user_date     ON transactions(user_id, transaction_date);
-- Secondary: filter by type within a user
CREATE INDEX idx_tx_user_type     ON transactions(user_id, type);
-- For category-breakdown charts
CREATE INDEX idx_tx_category_date ON transactions(category_id, transaction_date);


-- ------------------------------------------------------------
-- 4. fixed_expenses
-- ------------------------------------------------------------
-- Rationale: fixed recurring costs (rent, utilities, subscriptions)
-- are separate from regular transactions so the UI can:
--   a) auto-generate monthly entries
--   b) warn users when they are near budget
-- end_date NULL means the expense is still active (open-ended).
-- ------------------------------------------------------------
CREATE TABLE fixed_expenses (
  id            CHAR(36)                  NOT NULL,
  user_id       CHAR(36)                  NOT NULL,
  category_id   CHAR(36)                  NOT NULL,
  name          VARCHAR(150)              NOT NULL,
  amount        DECIMAL(12,2)             NOT NULL,
  frequency     ENUM('monthly','yearly')  NOT NULL DEFAULT 'monthly',
  day_of_month  TINYINT UNSIGNED                   DEFAULT NULL,  -- 1–28 billing day
  start_date    DATE                      NOT NULL,
  end_date      DATE                               DEFAULT NULL,
  description   VARCHAR(255)                       DEFAULT NULL,
  is_active     TINYINT(1)                NOT NULL DEFAULT 1,
  created_at    DATETIME                  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME                  NOT NULL DEFAULT CURRENT_TIMESTAMP
                                                   ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_fe_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_fe_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_fe_user_active ON fixed_expenses(user_id, is_active);


-- ============================================================
-- Useful reporting VIEW (optional, safe to drop)
-- ============================================================
CREATE OR REPLACE VIEW v_monthly_summary AS
SELECT
  t.user_id,
  DATE_FORMAT(t.transaction_date, '%Y-%m') AS month,
  t.type,
  SUM(t.amount)                             AS total
FROM transactions t
GROUP BY t.user_id, month, t.type;

-- ============================================================
-- End of schema
-- ============================================================
