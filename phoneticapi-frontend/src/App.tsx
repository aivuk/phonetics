import './App.css'
import TextField from '@mui/material/TextField'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Grid from '@mui/material/Grid'
import *  as React from 'react'
import { useState } from 'react'

function App() {
  const [words1, setWords1] = useState("")
  const [words2, setWords2] = useState("")
  const [lang, setLang] = useState("de")
  const [homophones, setHomophones] = useState(false)
  const [needToCheck, setNeedToCheck] = useState(true)

  async function sendRequest() {
    let api_response = await fetch('/api/phonetic/', { 
        method: 'POST',
        mode: "cors",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({'words1': words1, 'words2': words2, 'lang': lang})
    })
    let api_result = await api_response.json();
    setNeedToCheck(false)
    setHomophones(api_result["homophones"])
  }

  function onWordsFieldChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, setWords: React.Dispatch<string>) {
    setWords(event.target.value)
    setNeedToCheck(true)
  }

  function handleLangChange(event: SelectChangeEvent) {
    setLang(event.target.value)
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FormControl>
        <InputLabel id="select-lang-label">Language</InputLabel>
        <Select
          labelId="select-lang-label"
          value={lang}
          label="Language"
          onChange={handleLangChange}
        >
          <MenuItem value={"de"}>German - Cologne Phonetics</MenuItem>
          <MenuItem value={"en_soundex"}>English - Soundex</MenuItem>
          <MenuItem value={"en_metaphone"}>English - Metaphone</MenuItem>
        </Select>
        </FormControl>
      </Grid>
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
