import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const query = formData.get('query') as string;

    if (!file || !query) {
      return NextResponse.json(
        { success: false, error: 'Missing file or query' },
        { status: 400 }
      );
    }

    // Forward to backend
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    const backendFormData = new FormData();
    backendFormData.append('file', file);
    backendFormData.append('query', query);

    const response = await axios.post(`${backendUrl}/analyze`, backendFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 120000, // 2 minute timeout
    });

    return NextResponse.json(response.data);

  } catch (error: any) {
    console.error('API route error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.response?.data?.detail || error.message || 'Analysis failed' 
      },
      { status: 500 }
    );
  }
}