import { useState, useEffect } from 'react'
import 'prismjs/themes/prism-tomorrow.css'
import prism from 'prismjs'
import Editor from 'react-simple-code-editor'
import axios from 'axios'
import Markdown from 'react-markdown'
import {Loader2} from 'lucide-react'
import './App.css'

function App() {

  const [code, setCode] = useState(`function sum(){
  return 1+1
}`)

  const [review, setReview] = useState()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    prism.highlightAll()
  })

  async function reviewCode() {

    setIsLoading(true)
    const response = await axios.post('https://ai-based-code-reviewer.onrender.com/ai/get-review', { code })

    // console.log(respnse.data)

    setReview(response.data)
    setIsLoading(false)

  }

  return (
    <>
      <main>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", "monospace',
                fontSize: 16,
                border: "2px solid grey",
                borderRadius: "5px",
                height: "100%",
                width: "100%"

              }}
            />


          </div>
          <div onClick={reviewCode} className="review hover:cursor-pointer bg-[#0BBDF4] hover:bg-[#07799C]">Review</div>
        </div>
        <div className="right">
          <div className="container">
            <Markdown>
              {
                isLoading ? <Loader2 className="animate-spin mx-auto" /> :
                review
              }
              
            </Markdown>
          </div>
        </div>
      </main>
    </>
  )
}

export default App
