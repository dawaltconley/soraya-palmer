/** @typedef {import('aws-lambda').APIGatewayProxyEvent} ProxyEvent */
/** @typedef {import('aws-lambda').APIGatewayProxyResult} ProxyResult */

const { ALLOW_ORIGIN, HONEYPOT_FIELDS, MAILERLITE_API_KEY } = process.env

const corsHeaders = ALLOW_ORIGIN
  ? {
      'Access-Control-Allow-Origin': ALLOW_ORIGIN,
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET',
    }
  : {}

/**
 * @param {number} statusCode
 * @param {string} message
 * @return ProxyResult
 */
const makeResponse = (statusCode, message) => ({
  statusCode,
  headers: corsHeaders,
  body: JSON.stringify({ message }),
})

const success = makeResponse(200, 'Success')
const honeypots = HONEYPOT_FIELDS?.split(',') || []

/**
 * @param {ProxyEvent} event
 * @return {Promise<ProxyResult>}
 */
exports.lambdaHandler = async function handler(event) {
  try {
    // validate query string
    if (!event.queryStringParameters) {
      return makeResponse(400, 'Missing query string parameters')
    }
    const { email } = event.queryStringParameters
    if (!email) {
      return makeResponse(400, 'Missing required field: email')
    }
    for (let honeypot of honeypots) {
      if (event.queryStringParameters[honeypot]) {
        console.error('Detected spam', event)
        return success
      }
    }

    // post to mailerlite api
    const response = await fetch(
      'https://connect.mailerlite.com/api/subscribers',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${MAILERLITE_API_KEY}`,
        },
        body: JSON.stringify({
          email,
          groups: ['113897420206638767'],
        }),
      },
    )

    // handle response
    const responseBody = await response.json()
    if (response.status >= 400) {
      console.error(responseBody)
      return makeResponse(500, 'Server Error')
    }
    console.log('Mailerlite success', responseBody)
    return success
  } catch (error) {
    // return 500 for any other error
    console.error(error)
    return makeResponse(500, 'Server Error')
  }
}
