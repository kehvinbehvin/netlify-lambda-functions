/**
 * Netlify will provide event and context parameters when function is invoked
 */

exports.handler = async function(event, context) {
    return {
        statusCode: 200,
        body: JSON.stringify({message: "Hello World!!!"})
    }
}

