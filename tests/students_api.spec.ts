import { test } from '@playwright/test';
 
test('Browser type unique API-key', async ({ browserName }) => {
    const response = await fetch('https://test-379574553568.us-central1.run.app/student',
    {
        headers: {'api_key': `percar-${browserName}`}
    })
    const responsejson = await response.json()
    console.log(responsejson)
})

