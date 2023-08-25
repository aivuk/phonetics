import './App.css'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Grid from '@mui/material/Grid'
import { useState } from 'react'

function App() {
  const [words1, setWords1] = useState("")
  const [words2, setWords2] = useState("")
  const [homophones, setHomophones] = useState(false)
  const [needToCheck, setNeedToCheck] = useState(true)

  async function sendRequest() {
    let api_response = await fetch('http://localhost:8082/api/phonetic/', { 
        method: 'POST',
        mode: "cors",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({'words1': words1, 'words2': words2, 'lang': 'de'})
    })
    let api_result = await api_response.json();
    console.log(api_result)
    setNeedToCheck(false)
    setHomophones(api_result["homophones"])
  }

  function onWordsFieldChange(event, setWords) {
    setWords(event.target.value)
    setNeedToCheck(true)
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
         <TextField id="outlined-basic" value={words1} onChange={(e) => onWordsFieldChange(e, setWords1)} label="One or more words" variant="outlined" />
      </Grid>
      <Grid item xs={12}>
         <TextField id="outlined-basic" value={words2} onChange={(e) => onWordsFieldChange(e, setWords2)} label="One or more words" variant="outlined" />
      </Grid>
      <Grid item xs={12}>
         <Button variant="contained" onClick={sendRequest}>Compare words</Button>
      </Grid>
      <Grid item xs={12}>
        { !needToCheck && 
        <>
          { homophones? 
          <Alert severity="success"><h1>They are homophones</h1></Alert>:
          <Alert severity="warning"><h1>Not homophones</h1></Alert>
          }
        </>
        } 
      </Grid>
    </Grid>
  )
}

export default App
