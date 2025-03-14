import { NextResponse } from 'next/server'
import { supabase } from '@/utils/supabase'

export async function GET() {
  try {
    // Создаем таблицу todos (если она еще не существует)
    const { error: createError } = await supabase.rpc('create_todos_table')
    if (createError) {
      console.error('Error creating table:', createError)
    }

    // Добавляем тестовые данные
    const { data, error } = await supabase
      .from('todos')
      .insert([
        { title: 'Купить продукты', completed: false },
        { title: 'Сделать домашнее задание', completed: true },
        { title: 'Позвонить маме', completed: false }
      ])
      .select()

    if (error) throw error

    return NextResponse.json({ 
      message: 'Test data inserted successfully', 
      data 
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 