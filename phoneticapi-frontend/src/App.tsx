import './App.css'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Grid from '@mui/material/Grid'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import *  as React from 'react'
import { useState } from 'react'

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const columns: GridColDef[] = [
  { field: 'word1', headerName: 'Word 1' },
  { field: 'word2', headerName: 'Word 2' },
  { field: 'frequency', headerName: 'Frequency' }
]

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function App() {
  const [words1, setWords1] = useState("")
  const [words2, setWords2] = useState("")
  const [lang, setLang] = useState("de")
  const [homophones, setHomophones] = useState(false)
  const [needToCheck, setNeedToCheck] = useState(true)
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [methods, setMethods] = React.useState([] as any[])
  const [wordsPairsLanguage, setWordsPairsLanguage] = React.useState("de")
  const [wordsPairs, setWordsPairs] = React.useState([] as any[])

  React.useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/supported_languages`, { 
         method: 'GET',
    }).then(async (res) => {
        let apiMethods = await res.json()
        setMethods(apiMethods)
    })
  }, [])

  async function sendRequest() {
    let api_response = await fetch(`${import.meta.env.VITE_API_URL}/api/phonetic/`, { 
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

  function handleWordsPairsLanguageChange(event: SelectChangeEvent) {
    setWordsPairsLanguage(event.target.value)
  }

  // Update Frequency table 
  React.useEffect(() => {
    getWordsPairs(wordsPairsLanguage)
      }, [wordsPairsLanguage])

  async function getWordsPairs(language: string) {
    fetch(`${import.meta.env.VITE_API_URL}/api/words_pairs/${language}`, { 
         method: 'GET',
    }).then(async (res) => {
      let responseData = await res.json()
      let rows = []
      let i = 1
      for (let row of responseData) {
        rows.push(
          {
            'id': i++,
            'word1': row[0],
            'word2': row[1],
            'frequency': row[2]
          }
            )
      }
      setWordsPairs(rows)
    })

  }

  const handleTabChange = (event: React.SyntheticEvent, tabNumber: number) => {
    setSelectedTab(tabNumber);
    if (tabNumber == 2) {
      getWordsPairs(wordsPairsLanguage)
    }
    event
  }

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Box sx={{ marginBottom: '80px', borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={selectedTab} onChange={handleTabChange} aria-label="Select Tab" centered>
          <Tab label="Check words" {...a11yProps(0)} />
          <Tab label="Methods" {...a11yProps(1)} />
          <Tab label="Frequency" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={selectedTab} index={0}>
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
             <TextField fullWidth id="outlined-basic" value={words1} onChange={(e) => onWordsFieldChange(e, setWords1)} label="One or more words" variant="outlined" />
          </Grid>
          <Grid item xs={12}>
             <TextField fullWidth id="outlined-basic" value={words2} onChange={(e) => onWordsFieldChange(e, setWords2)} label="One or more words" variant="outlined" />
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
      </TabPanel>
      <TabPanel value={selectedTab} index={1}>
        <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {methods.map((m, i) => {
              return (m && (
                <Grid item xs={12} md={4}>
                            <Card key={`m-${i}`} sx={{ marginBottom: '20px' }}>
                              <CardContent>
                                <Typography variant="h5" component="div">
                                  {m.language}
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                  {m.method}
                                </Typography>
                              </CardContent>
                              <CardActions>
                                <Button sx={{ margin: 'auto' }} href={m.reference} target="_blank" size="small">About</Button>
                              </CardActions>
                            </Card>
                </Grid>
              ))
             }
          )}
        </Grid>
        </Box>
      </TabPanel>
      <TabPanel value={selectedTab} index={2}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl>
            <InputLabel id="select-lang-label">Language</InputLabel>
            <Select
              labelId="select-lang-label"
              value={wordsPairsLanguage}
              label="Language"
              onChange={handleWordsPairsLanguageChange}
            >
              <MenuItem value={"de"}>German - Cologne Phonetics</MenuItem>
              <MenuItem value={"en_soundex"}>English - Soundex</MenuItem>
              <MenuItem value={"en_metaphone"}>English - Metaphone</MenuItem>
            </Select>
            </FormControl>
          </Grid>
          <Grid sx={{ maxWidth: { xs: '100%', md: '50%'}, margin: 'auto' }}  alignItems="center" item xs={12}>
            <DataGrid
              rows={wordsPairs}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 100 },
                },
              }}
              pageSizeOptions={[10, 25, 50, 75, 100]}
            />
          </Grid>
        </Grid>
      </TabPanel>

    </Box>
  )
}

export default App
