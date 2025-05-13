# API Documentation

## Authentication
- API Key required for all requests
- Include in `Authorization` header
- Recommended: Use environment variables

## Endpoints

### Bot Management

#### Create Bot
- **Endpoint**: `/bots`
- **Method**: `POST`
- **Request Body**:
```json
{
  "name": "US Visa Bot",
  "embassy": "US Embassy",
  "country": "United States",
  "searchParameters": {
    "visaType": "Tourist",
    "dateRange": {
      "start": "2024-01-01",
      "end": "2024-12-31"
    }
  }
}
```

#### List Bots
- **Endpoint**: `/bots`
- **Method**: `GET`
- **Response**:
```json
{
  "bots": [
    {
      "id": "bot-123",
      "name": "US Visa Bot",
      "status": "running",
      "lastChecked": "2024-05-13T10:30:00Z"
    }
  ]
}
```

### Appointment Management

#### Get Appointments
- **Endpoint**: `/appointments`
- **Method**: `GET`
- **Query Parameters**:
  - `botId`: Filter by specific bot
  - `status`: Filter by appointment status
  - `dateFrom`: Start date range
  - `dateTo`: End date range

#### Export Appointments
- **Endpoint**: `/appointments/export`
- **Method**: `GET`
- **Formats**: CSV, Excel

## Error Handling
- Consistent error response structure
- HTTP status codes
- Detailed error messages

### Error Response Example
```json
{
  "error": {
    "code": "INVALID_PARAMETERS",
    "message": "Invalid bot configuration",
    "details": ["Embassy not specified"]
  }
}
```

## Rate Limiting
- 100 requests per minute
- Burst limit: 200 requests
- Excess requests return 429 status

## Webhook Notifications
- Real-time bot and appointment updates
- Configurable notification endpoints

## Best Practices
- Use HTTPS
- Implement proper error handling
- Validate all input parameters
- Secure API keys
