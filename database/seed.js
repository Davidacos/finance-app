/**
 * seed.js — Finance App Database Seeder
 * ─────────────────────────────────────
 * Usage:
 *   node database/seed.js
 *
 * Requires:
 *   npm install mysql2 bcryptjs dotenv
 *
 * Environment variables (create a .env file in the project root):
 *   DB_HOST     = localhost
 *   DB_PORT     = 3306
 *   DB_USER     = root
 *   DB_PASSWORD = yourpassword
 *   DB_NAME     = finance_app
 */

import "dotenv/config";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns a DATE string (YYYY-MM-DD) for a random day in the current month */
function randomDateThisMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-based
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const day = Math.floor(Math.random() * daysInMonth) + 1;
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** Returns a DATE string N months ago */
function dateMonthsAgo(n) {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  return d.toISOString().slice(0, 10);
}

/** Round to 2 decimals */
const money = (n) => parseFloat(n.toFixed(2));

// ─── Connection ───────────────────────────────────────────────────────────────

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "finance_app",
  waitForConnections: true,
  connectionLimit: 5,
});

// ─── Seed Data ────────────────────────────────────────────────────────────────

async function seed() {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    console.log("🌱 Starting seed...\n");

    // ── 1. User ────────────────────────────────────────────────────────────────
    const userId = randomUUID();
    const passwordHash = await bcrypt.hash("Demo1234!", 12);

    await conn.execute(
      `INSERT INTO users
         (id, email, password_hash, first_name, last_name, currency_code, language, monthly_budget)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, "demo@financeapp.com", passwordHash, "Joan", "Demo", "USD", "es", 3000.00]
    );
    console.log(`✅ User created → ${userId}`);

    // ── 2. Categories ──────────────────────────────────────────────────────────
    const cats = {
      // income
      salario:        { type: "income",  icon: "💼", color: "#22c55e" },
      freelance:      { type: "income",  icon: "💻", color: "#10b981" },
      // expense
      comida:         { type: "expense", icon: "🍔", color: "#ef4444" },
      transporte:     { type: "expense", icon: "🚌", color: "#f97316" },
      arriendo:       { type: "expense", icon: "🏠", color: "#8b5cf6" },
      entretenimiento:{ type: "expense", icon: "🎬", color: "#ec4899" },
      servicios:      { type: "expense", icon: "💡", color: "#eab308" },
    };

    const catIds = {};
    for (const [name, meta] of Object.entries(cats)) {
      const id = randomUUID();
      catIds[name] = id;
      await conn.execute(
        `INSERT INTO categories (id, user_id, name, type, icon, color, is_default)
         VALUES (?, ?, ?, ?, ?, ?, 1)`,
        [id, userId, name.charAt(0).toUpperCase() + name.slice(1), meta.type, meta.icon, meta.color]
      );
    }
    console.log(`✅ ${Object.keys(cats).length} categories created`);

    // ── 3. Transactions ────────────────────────────────────────────────────────
    // 25 transactions: ~8 income + ~17 expense, spread across the current month
    const transactions = [
      // --- INCOME ---
      { cat: "salario",   type: "income",  amount: 2800.00, desc: "Salario mensual empresa",     method: "bank_transfer" },
      { cat: "salario",   type: "income",  amount: 200.00,  desc: "Bonificación por desempeño",  method: "bank_transfer" },
      { cat: "freelance", type: "income",  amount: 450.00,  desc: "Proyecto diseño web cliente", method: "bank_transfer" },
      { cat: "freelance", type: "income",  amount: 280.00,  desc: "Consultoría React - StartupX", method: "bank_transfer" },
      { cat: "freelance", type: "income",  amount: 150.00,  desc: "Logo branding freelance",     method: "cash" },
      { cat: "freelance", type: "income",  amount: 320.00,  desc: "API integración e-commerce",  method: "bank_transfer" },
      { cat: "salario",   type: "income",  amount: 100.00,  desc: "Reembolso gastos viaje",       method: "bank_transfer" },
      { cat: "freelance", type: "income",  amount: 90.00,   desc: "Soporte técnico cliente",      method: "cash" },

      // --- EXPENSE ---
      { cat: "arriendo",        type: "expense", amount: 750.00,  desc: "Arriendo apartamento abril",  method: "bank_transfer" },
      { cat: "servicios",       type: "expense", amount: 65.00,   desc: "Factura electricidad",         method: "debit_card" },
      { cat: "servicios",       type: "expense", amount: 42.00,   desc: "Factura internet fibra",        method: "debit_card" },
      { cat: "servicios",       type: "expense", amount: 25.00,   desc: "Factura agua",                  method: "debit_card" },
      { cat: "servicios",       type: "expense", amount: 18.50,   desc: "Netflix suscripción",           method: "credit_card" },
      { cat: "servicios",       type: "expense", amount: 10.99,   desc: "Spotify Premium",               method: "credit_card" },
      { cat: "servicios",       type: "expense", amount: 14.99,   desc: "Adobe Creative Cloud",          method: "credit_card" },
      { cat: "comida",          type: "expense", amount: 95.40,   desc: "Mercado semanal 1",             method: "debit_card" },
      { cat: "comida",          type: "expense", amount: 87.20,   desc: "Mercado semanal 2",             method: "debit_card" },
      { cat: "comida",          type: "expense", amount: 22.50,   desc: "Almuerzo restaurante",          method: "cash" },
      { cat: "comida",          type: "expense", amount: 38.00,   desc: "Cena familiar",                 method: "credit_card" },
      { cat: "comida",          type: "expense", amount: 12.80,   desc: "Café y snacks trabajo",         method: "cash" },
      { cat: "transporte",      type: "expense", amount: 55.00,   desc: "Tarjeta mensual metro/bus",     method: "debit_card" },
      { cat: "transporte",      type: "expense", amount: 32.00,   desc: "Gasolina vehículo",             method: "cash" },
      { cat: "transporte",      type: "expense", amount: 18.00,   desc: "Taxi aeropuerto",               method: "credit_card" },
      { cat: "entretenimiento", type: "expense", amount: 45.00,   desc: "Entradas cine + palomitas",     method: "credit_card" },
      { cat: "entretenimiento", type: "expense", amount: 60.00,   desc: "Salida nocturna amigos",        method: "cash" },
    ];

    let txCount = 0;
    for (const tx of transactions) {
      await conn.execute(
        `INSERT INTO transactions
           (id, user_id, category_id, type, amount, description, transaction_date, payment_method)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          randomUUID(),
          userId,
          catIds[tx.cat],
          tx.type,
          money(tx.amount),
          tx.desc,
          randomDateThisMonth(),
          tx.method,
        ]
      );
      txCount++;
    }
    console.log(`✅ ${txCount} transactions created`);

    // ── 4. Fixed Expenses ──────────────────────────────────────────────────────
    const fixedExpenses = [
      {
        cat: "arriendo",
        name: "Arriendo apartamento",
        amount: 750.00,
        frequency: "monthly",
        dayOfMonth: 1,
        start: dateMonthsAgo(6),
        desc: "Pago mensual de arriendo",
      },
      {
        cat: "servicios",
        name: "Plan internet fibra 300MB",
        amount: 42.00,
        frequency: "monthly",
        dayOfMonth: 5,
        start: dateMonthsAgo(12),
        desc: "ISP - facturación automática",
      },
      {
        cat: "servicios",
        name: "Netflix Premium",
        amount: 18.50,
        frequency: "monthly",
        dayOfMonth: 15,
        start: dateMonthsAgo(24),
        desc: "Suscripción streaming vídeo",
      },
      {
        cat: "servicios",
        name: "Spotify Premium",
        amount: 10.99,
        frequency: "monthly",
        dayOfMonth: 20,
        start: dateMonthsAgo(18),
        desc: "Suscripción streaming música",
      },
      {
        cat: "servicios",
        name: "Adobe Creative Cloud",
        amount: 14.99,
        frequency: "monthly",
        dayOfMonth: 10,
        start: dateMonthsAgo(8),
        desc: "Suite diseño Adobe",
      },
      {
        cat: "servicios",
        name: "Seguro de salud anual",
        amount: 480.00,
        frequency: "yearly",
        dayOfMonth: null,
        start: dateMonthsAgo(3),
        desc: "Póliza seguro médico privado",
      },
    ];

    let feCount = 0;
    for (const fe of fixedExpenses) {
      await conn.execute(
        `INSERT INTO fixed_expenses
           (id, user_id, category_id, name, amount, frequency, day_of_month, start_date, description, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [
          randomUUID(),
          userId,
          catIds[fe.cat],
          fe.name,
          money(fe.amount),
          fe.frequency,
          fe.dayOfMonth,
          fe.start,
          fe.desc,
        ]
      );
      feCount++;
    }
    console.log(`✅ ${feCount} fixed expenses created`);

    // ── Commit ──────────────────────────────────────────────────────────────────
    await conn.commit();

    // ── Summary ─────────────────────────────────────────────────────────────────
    const totalIncome  = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);

    console.log("\n─────────────────────────────────────────");
    console.log("📊 Seed Summary:");
    console.log(`   👤 Users           : 1`);
    console.log(`   🏷️  Categories      : ${Object.keys(cats).length}`);
    console.log(`   💳 Transactions    : ${txCount}`);
    console.log(`   📌 Fixed expenses  : ${feCount}`);
    console.log(`   📈 Total income    : $${money(totalIncome).toFixed(2)}`);
    console.log(`   📉 Total expenses  : $${money(totalExpense).toFixed(2)}`);
    console.log(`   💰 Net balance     : $${money(totalIncome - totalExpense).toFixed(2)}`);
    console.log("─────────────────────────────────────────");
    console.log("🚀 Seed complete. Login: demo@financeapp.com / Demo1234!\n");

  } catch (err) {
    await conn.rollback();
    console.error("❌ Seed failed — transaction rolled back:", err.message);
    process.exit(1);
  } finally {
    conn.release();
    await pool.end();
  }
}

seed();
