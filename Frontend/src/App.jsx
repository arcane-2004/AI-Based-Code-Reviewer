import { useState, useEffect } from 'react'
import 'prismjs/themes/prism-tomorrow.css'
import Prism from 'prismjs'
import Editor from 'react-simple-code-editor'
import axios from 'axios'
import Markdown from 'react-markdown'
import { Loader2 } from 'lucide-react'
import './App.css'

function App() {
  const [code, setCode] = useState(`function sum() {
  return 1 + 1;
}`)

  const [review, setReview] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Highlight code after every update
  useEffect(() => {
    Prism.highlightAll()
  }, [code, review]) // add dependency array to avoid re-running infinitely

  async function reviewCode() {
    try {
      setIsLoading(true)
      const response = await axios.post(
        'https://ai-based-code-reviewer.onrender.com/ai/get-review',
        { code }
      )

      setReview(response.data)
    } catch (error) {
      console.error("Error reviewing code:", error)
      setReview("❌ Failed to get review. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex flex-col md:flex-row min-h-screen">
      {/* LEFT PANEL */}
      <div className="left flex-1 flex flex-col p-4">
        <div className="code flex-1">
          <Editor
            value={code}
            onValueChange={setCode}
            highlight={(code) => Prism.highlight(code, Prism.languages.javascript, "javascript")}
            padding={10}
            style={{
              fontFamily: '"Fira Code", "Fira Mono", monospace',
              fontSize: 16,
              border: "2px solid grey",
              borderRadius: "5px",
              height: "100%",
              width: "100%",
            }}
          />
        </div>

        <button
          onClick={reviewCode}
          className="review mt-4 p-2 text-white font-semibold rounded bg-[#0BBDF4] hover:bg-[#07799C] transition-all duration-300"
        >
          {isLoading ? "Reviewing..." : "Review"}
        </button>
      </div>

      {/* RIGHT PANEL */}
      <div className="right flex-1 p-4 overflow-auto">
        <div className="container border border-gray-400 rounded p-4 min-h-[200px]">
          {isLoading ? (
            <Loader2 className="animate-spin mx-auto text-[#0BBDF4]" />
          ) : (
            <Markdown>{review}</Markdown>
          )}
        </div>
      </div>
    </main>
  )
}

export default App
