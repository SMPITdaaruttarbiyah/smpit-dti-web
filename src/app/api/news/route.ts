import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), 'public/assets/data/news.json')
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({
        lastUpdated: new Date().toISOString(),
        syncType: 'automatic',
        version: '1.0.0',
        news: [],
        statistics: {
          totalNews: 0,
          categories: [],
          lastSync: new Date().toISOString()
        }
      })
    }

    const fileContents = fs.readFileSync(filePath, 'utf8')
    const newsData = JSON.parse(fileContents)
    
    return NextResponse.json(newsData)
  } catch (error) {
    console.error('Error reading news data:', error)
    return NextResponse.json(
      { error: 'Failed to load news data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const newsData = await request.json()
    
    // Validate the data structure
    if (!newsData.news || !Array.isArray(newsData.news)) {
      return NextResponse.json(
        { error: 'Invalid news data format' },
        { status: 400 }
      )
    }
    
    const filePath = path.join(process.cwd(), 'public/assets/data/news.json')
    
    // Ensure directory exists
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    
    // Write the news data
    fs.writeFileSync(filePath, JSON.stringify(newsData, null, 2))
    
    return NextResponse.json({
      success: true,
      message: 'News data saved successfully',
      statistics: {
        totalNews: newsData.news.length,
        categories: [...new Set(newsData.news.map((item: any) => item.category))],
        lastSync: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error saving news data:', error)
    return NextResponse.json(
      { error: 'Failed to save news data' },
      { status: 500 }
    )
  }
}