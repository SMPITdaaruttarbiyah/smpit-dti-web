import { NextRequest, NextResponse } from 'next/server';

// GitHub repository configuration
const GITHUB_CONFIG = {
  owner: 'SMPITdaaruttarbiyah',
  repo: 'smpit-dti-web',
  branch: 'main',
  filePath: 'data/news.json'
};

// Cache duration in milliseconds (1 minute for faster updates)
const CACHE_DURATION = 1 * 60 * 1000;
let cachedData: any = null;
let lastFetch = 0;

async function fetchNewsFromGitHub() {
  try {
    const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.filePath}`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'SMPIT-DTI-Website'
      },
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!response.ok) {
      if (response.status === 404) {
        // File doesn't exist, return empty news
        return {
          version: '2.0.0',
          lastUpdated: new Date().toISOString(),
          website: 'SMPIT DAARUT TARBIYAH INDONESIA',
          totalNews: 0,
          news: [],
          metadata: {
            updatedAt: new Date().toISOString(),
            updatedBy: 'System'
          }
        };
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Decode base64 content
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    const newsData = JSON.parse(content);

    // Transform data to match expected structure
    const transformedData = {
      version: newsData.version || '2.0.0',
      lastUpdated: newsData.lastUpdated || new Date().toISOString(),
      website: 'SMPIT DAARUT TARBIYAH INDONESIA',
      totalNews: newsData.news ? newsData.news.length : 0,
      news: newsData.news || [],
      metadata: {
        updatedAt: newsData.lastUpdated || new Date().toISOString(),
        updatedBy: 'GitHub API'
      }
    };

    return transformedData;
  } catch (error) {
    console.error('Error fetching news from GitHub:', error);
    // Return empty data structure on error
    return {
      version: '2.0.0',
      lastUpdated: new Date().toISOString(),
      website: 'SMPIT DAARUT TARBIYAH INDONESIA',
      totalNews: 0,
      news: [],
      metadata: {
        updatedAt: new Date().toISOString(),
        updatedBy: 'System',
        error: 'Failed to fetch from GitHub'
      }
    };
  }
}

export async function GET(request: NextRequest) {
  try {
    const now = Date.now();
    const { searchParams } = new URL(request.url);
    const bypassCache = searchParams.get('bypassCache') === 'true';
    
    // Check if we have cached data that's still valid (unless bypassing cache)
    if (!bypassCache && cachedData && (now - lastFetch) < CACHE_DURATION) {
      console.log('Returning cached data');
      return NextResponse.json(cachedData);
    }

    console.log(bypassCache ? 'Bypassing cache - fetching fresh data' : 'Fetching fresh data from GitHub');
    // Fetch fresh data from GitHub
    const newsData = await fetchNewsFromGitHub();
    
    // Update cache
    cachedData = newsData;
    lastFetch = now;

    console.log('News data loaded:', {
      totalNews: newsData.totalNews,
      lastUpdated: newsData.lastUpdated
    });

    return NextResponse.json(newsData);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch news',
        news: [],
        totalNews: 0,
        version: '2.0.0',
        lastUpdated: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // This endpoint would be used by the admin panel to save news
    // For now, we'll just return success
    // In a real implementation, you might want to validate and save to a database
    
    console.log('Received news data:', body);
    
    return NextResponse.json({ 
      success: true, 
      message: 'News data received successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process news data',
        success: false
      },
      { status: 500 }
    );
  }
}