#!/usr/bin/env node

/**
 * Скрипт для настройки базы данных Supabase
 * 
 * Этот скрипт помогает настроить базу данных Supabase для образовательной платформы.
 * Он считывает SQL-скрипт из файла supabase-schema.sql и выполняет его через Supabase API.
 * 
 * Использование:
 * 1. Убедитесь, что у вас есть файл .env.local с переменными SUPABASE_URL и SUPABASE_SERVICE_KEY
 * 2. Запустите скрипт: node setup-database.js
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Проверка наличия переменных окружения
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  console.error('Ошибка: Не найдены переменные окружения NEXT_PUBLIC_SUPABASE_URL или SUPABASE_SERVICE_KEY');
  console.error('Пожалуйста, создайте файл .env.local с этими переменными');
  process.exit(1);
}

// Создание клиента Supabase с сервисным ключом (не анонимным)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function setupDatabase() {
  try {
    console.log('Начинаем настройку базы данных...');
    
    // Чтение SQL-скрипта
    const sqlFilePath = path.join(__dirname, 'supabase-schema.sql');
    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Разделение скрипта на отдельные SQL-запросы
    // Это упрощенный подход, который может не работать для сложных SQL-скриптов
    const queries = sqlScript
      .split(';')
      .map(query => query.trim())
      .filter(query => query.length > 0);
    
    console.log(`Найдено ${queries.length} SQL-запросов для выполнения`);
    
    // Выполнение каждого запроса
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      console.log(`Выполнение запроса ${i + 1}/${queries.length}...`);
      
      const { error } = await supabase.rpc('exec_sql', { sql: query });
      
      if (error) {
        console.error(`Ошибка при выполнении запроса ${i + 1}:`, error);
        // Продолжаем выполнение, даже если есть ошибки
      }
    }
    
    console.log('Настройка базы данных завершена!');
  } catch (error) {
    console.error('Произошла ошибка при настройке базы данных:', error);
    process.exit(1);
  }
}

setupDatabase(); 