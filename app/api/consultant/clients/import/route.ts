import { NextRequest, NextResponse } from 'next/server'

// This is a simplified version - in production, you'd use a library like 'xlsx' or 'csv-parser'
// For now, we'll create a structure that can be extended with actual parsing logic

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv', // .csv
    ]
    
    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload an Excel (.xlsx, .xls) or CSV file.' },
        { status: 400 }
      )
    }

    // Read file content
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Parse the file
    // Note: In production, you would use libraries like:
    // - 'xlsx' for Excel files: npm install xlsx
    // - 'csv-parser' or 'papaparse' for CSV files: npm install csv-parser papaparse
    // For now, we'll return a mock structure that demonstrates the expected format

    // Mock extraction - replace this with actual parsing logic
    const extractedClients = await extractClientsFromFile(buffer, file.name, file.type)

    return NextResponse.json({
      success: true,
      clients: extractedClients,
      message: `Successfully extracted ${extractedClients.length} clients from file.`,
    })
  } catch (error: any) {
    console.error('Error importing clients:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to import clients from file' },
      { status: 500 }
    )
  }
}

// Mock extraction function - replace with actual parsing logic
async function extractClientsFromFile(
  buffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<any[]> {
  // This is a placeholder - in production, implement actual parsing:
  
  // For Excel files (.xlsx, .xls):
  // const XLSX = require('xlsx')
  // const workbook = XLSX.read(buffer, { type: 'buffer' })
  // const sheetName = workbook.SheetNames[0]
  // const worksheet = workbook.Sheets[sheetName]
  // const data = XLSX.utils.sheet_to_json(worksheet)
  
  // For CSV files:
  // const csv = require('csv-parser')
  // or use papaparse: const Papa = require('papaparse')
  // const results = Papa.parse(csvString, { header: true })
  
  // Expected column mappings (flexible):
  // - Name: 'name', 'client name', 'customer name', 'full name'
  // - Company: 'company', 'company name', 'business name'
  // - Email: 'email', 'email address', 'e-mail'
  // - Phone: 'phone', 'phone number', 'mobile', 'contact'
  // - Location: 'location', 'address', 'city'
  // - Status: 'status', 'lead status'
  // - Notes: 'notes', 'remarks', 'comments'
  // - UEN: 'uen', 'business uen', 'registration number'
  
  // For now, return mock data to demonstrate the structure
  // Remove this and implement actual parsing
  
  return [
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+65 9123 4567',
      type: 'personal',
      location: 'Singapore',
      status: 'to call',
      notes: 'Extracted from sheet',
    },
    {
      name: 'ABC Trading Pte Ltd',
      companyName: 'ABC Trading Pte Ltd',
      email: 'contact@abctrading.sg',
      phone: '+65 6789 0123',
      type: 'business',
      location: 'Singapore',
      status: 'to book appointment',
      notes: 'Business client from import',
      businessUEN: '201234567A',
    },
  ]
}
