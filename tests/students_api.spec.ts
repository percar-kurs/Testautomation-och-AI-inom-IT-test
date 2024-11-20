import { test } from '@playwright/test';
 
test.only('Get students from API', async () => {
    const response = await fetch('https://test-379574553568.us-central1.run.app/student',
    {
        headers: {'api_key': 'XXXXX'}
    })
    const responsejson = await response.json()
    console.log(responsejson)
})