import { NextResponse } from 'next/server'
import { supabase } from '@/utils/supabase'

export async function GET() {
  try {
    // Сначала получаем список всех таблиц
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')

    if (tablesError) throw tablesError

    // Для каждой таблицы получаем данные
    const allData = {}
    for (const table of tables || []) {
      const { data, error } = await supabase
        .from(table.table_name)
        .select('*')
        .limit(5)  // Ограничиваем до 5 записей для каждой таблицы

      if (!error) {
        allData[table.table_name] = data
      }
    }

    return NextResponse.json({ 
      message: 'Data from all tables:', 
      data: allData
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 