import grapesjs from 'grapesjs';
import gjsBlocksBasic from 'grapesjs-blocks-basic';
import gjsPluginForms from 'grapesjs-plugin-forms';
import gjsComponentCountdown from 'grapesjs-component-countdown';
import gjsPluginExport from 'grapesjs-plugin-export';
import gjsTabs from 'grapesjs-tabs';
import gjsCustomCode from 'grapesjs-custom-code';
import gjsTouch from 'grapesjs-touch';
import gjsParserPostcss from 'grapesjs-parser-postcss';
import gjsTooltip from 'grapesjs-tooltip';
import gjsTuiImageEditor from 'grapesjs-tui-image-editor';
import gjsTyped from 'grapesjs-typed';
import gjsPresetWebpage from 'grapesjs-preset-webpage';
import gjsStyleBg from 'grapesjs-style-bg';
import gjsScriptEditor from 'grapesjs-script-editor';
import gjsComponentCodeEditor from 'grapesjs-component-code-editor';
import { debounce } from 'lodash'; // import lodash debounce function
import { useNavigate, useParams } from "react-router-dom";
import * as React from 'react';
import {useState, useEffect, useRef} from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup';
import 'prismjs/themes/prism.css';
import GjsEditor, {
  AssetsProvider,
  Canvas,
  ModalProvider,
} from '@grapesjs/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { MAIN_BORDER_COLOR } from './common';
import CustomModal from './CustomModal';
import CustomAssetManager from './CustomAssetManager';
import Topbar from './Topbar';
import RightSidebar from './RightSidebar';
import axios from 'axios';
import { io } from 'socket.io-client';
import { MAIN_BG_COLOR } from './common';
import { toast } from 'react-toastify';
import '../styles/editor.css';
const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const gjsOptions = {
  height: '100vh',
  stepsBeforeSave: 3,
  storageManager: {type: "remote"},
  undoManager: { trackSelection: false },
  selectorManager: { componentFirst: true },
};

function CustomEditor(){
  const BASE_URL = process.env.REACT_APP_BASE_URL
  // debounce duration for socket emit update project event, to avoid instant updates
  const DEBOUNCE_DURATION = 1000;
  // get project id from url parameters
  const {projectId} = useParams();
  const navigate = useNavigate();
  const socketRef = useRef(null); // Use a ref to hold the socket
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const isUpdatingFromServer = useRef(false); // Flag to track if update is from server
  const [isModalOpen, setIsModalOpen] = useState(false); // to keep track if the modal is open or not
  const [description, setDescription] = useState(''); // user's prompt
  const [generatedContent, setGeneratedContent] = useState(''); // to save the ai generated content
  const [isLoading, setIsLoading] = useState(false); // flag to keep track if the content is generating or generated

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setDescription('');
    setGeneratedContent('');
  };

  const handleGenerate = async () => {
    setIsLoading(true)
    setGeneratedContent("Generating code...")
    // send the request to chatgpt's api and get the response
    // custom prompt to avoid what we don't need
    try {
      const response = await axios.post('https://api.aimlapi.com/chat/completions', {
        model: 'gpt-4o-mini', // model
        messages: [{
          role: "user",
          content: `NO HTML, HEAD, BODY, STYLE TAGS, NO SUMMARY, NO EXPLANATION, NO JS, ONLY HTML CODE WITH INLINE STYLE\n ${description}`,
        }],
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_AI_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      // replace the markdown editing as we already have a markdown editor
      var content = response.data.choices[0].message.content
      content = content.replace("```html", "")
      content = content.replace("```", "")
      setGeneratedContent(content);
    } catch (error) {
      if (error.response){
        toast.error(error.response.data.message)
      } else {
        toast.error(error.message)
      }
      setGeneratedContent("Failed to generate content. Please try again.");
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    // Initialize socket connection
    const socket = io(`${BASE_URL}`, {
      extraHeaders: {
        Authorization: "Bearer " + window.localStorage.getItem("webweave-token"),
      },
    });

    socketRef.current = socket; // Set the socket ref
    socket.on("connect", () => {
      setIsSocketConnected(true); // Set connection status
      socket.emit("join_project", { projectId: projectId });
      console.log("JOINED");
    });

    // Listen for server updates and update the editor if the data is new
    socket.on("project_update", (data) => {
      isUpdatingFromServer.current = true; // Set flag to true
      window.editor.setComponents(data.html);
      window.editor.setStyle(data.css);
    });


    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [projectId]);

  const onEditor = (editor) => {
    window.editor = editor;
    // Debounced function to emit the "update_project" event
    const emitUpdateProject = debounce((data) => {
      const socket = socketRef.current;

      if (socket && !isUpdatingFromServer.current) {
        socket.emit("update_project", {
          projectId,
          html: editor.getHtml(),
          css: editor.getCss(),
          data: data,
          userEmail: window.localStorage.getItem("webweave-email"),
        });
      }

      // Reset the flag after handling the server update
      isUpdatingFromServer.current = false;
    }, DEBOUNCE_DURATION);

    editor.Storage.add("remote", {
      // load's project data from the backend
      async load(){
        try {
          const response = await axios.get(`${BASE_URL}/project/project_data?projectId=${projectId}`, {headers: {Authorization: "Bearer " + window.localStorage.getItem("webweave-token")}});
          if (response.status !== 200){
            console.log(response);
            navigate('/dashboard')
            return;
          }
          console.log(response)
          return response.data.data;
        } catch {
          navigate('/dashboard')
        }
      },
      async store(data){
        emitUpdateProject(data);
      },
        
    })
    // Custom header component here
    editor.Components.addType('custom-header', {
      model: {
        defaults: {
          icon: 'fa-solid fa-bars',
          tagName: 'header',
          draggable: true,
          droppable: true,
          editable: true,
          attributes: { class: 'custom-header' },
          content: `
            <h1>Your Custom Header</h1>
            <nav>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </nav>
          `,
        },
      },
    });

    // Add block for the custom header component
    editor.Blocks.add('custom-header', {
      label: 'Custom Header',
      category: 'Basic',
      content: { type: 'custom-header' },
    });

    // Add the AI button to the topbar
    editor.Panels.addButton('options', {
      id: 'ai-button',
      className: 'fa-solid fa-robot', // icon class for the AI button
      command: handleOpenModal, // Open the modal when clicked
      attributes: { title: 'Generate content with AI' },
    });
  };
  return (
    // theme provider to achieve easy designing
    <ThemeProvider theme={theme}>
      <GjsEditor
        className={`gjs-custom-editor text-white !${MAIN_BG_COLOR}`}
        grapesjs={grapesjs}
        grapesjsCss="https://unpkg.com/grapesjs/dist/css/grapes.min.css"
        options={gjsOptions}
        plugins={[gjsBlocksBasic, gjsPresetWebpage, gjsPluginForms, gjsComponentCountdown, gjsPluginExport, gjsTabs, gjsCustomCode, gjsTouch, gjsParserPostcss, gjsTooltip, gjsTyped, gjsScriptEditor, gjsComponentCodeEditor, gjsTuiImageEditor, gjsStyleBg]}
        onEditor={onEditor}
      >
        {/* modal for ai content generation */}
        <CustomModal open={isModalOpen} close={handleCloseModal} title="AI Code Generator">
          <div className="p-4">
            <div className="mb-4">
              <label htmlFor="description" className="block text-white font-medium">Describe your website:</label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
                placeholder="e.g., a portfolio website for a designer"
              />
            </div>
            <button
              onClick={handleGenerate}
              className="w-full py-2 mt-4 rounded bg-green-500 hover:bg-green-600 transition duration-300"
              disabled={isLoading}  // Disable button when loading
              >
              {isLoading ? 'Generating...' : 'Generate Content'}
            </button>
            <div>
              <label htmlFor="output" className="block text-white font-medium">Generated Content:</label>
              <Editor
                id="output"
                readOnly
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
                value={generatedContent}
                highlight={code => highlight(code, languages.markup)}
                padding={10}
                style={{
                  fontFamily: '"Fira code", "Fira Mono", monospace',
                  fontSize: 12,
                }}
              />
            </div>
          </div>
        </CustomModal>
      </GjsEditor>
    </ThemeProvider>
  )
}

export default CustomEditor
