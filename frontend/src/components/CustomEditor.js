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
import gjsStyleBg from 'grapesjs-style-bg';
import gjsScriptEditor from 'grapesjs-script-editor';
import { useNavigate, useParams } from "react-router-dom";
import * as React from 'react';
import {useState, useEffect, useRef} from 'react';
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
  const {projectId} = useParams();
  const navigate = useNavigate();
  const socketRef = useRef(null); // Use a ref to hold the socket
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const isUpdatingFromServer = useRef(false); // Flag to track if update is from server

  useEffect(() => {
    // Initialize socket connection
    const socket = io("http://localhost:5000", {
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
    editor.Storage.add("remote", {
      async load(){
        try {
          const response = await axios.get(`http://localhost:5000/project_data?projectId=${projectId}`, {headers: {Authorization: "Bearer " + window.localStorage.getItem("webweave-token")}});
          if (response.status !== 200){
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
        const socket = socketRef.current;

        // Only emit if the update is not from the server
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
      },
        
        // try {
        //   const response = await axios.post("http://localhost:5000/project_data", {projectId: projectId, data}, {headers: {Authorization: "Bearer " + window.localStorage.getItem("webweave-token")}})
        //   if (response.status !== 200){
        //     navigate('/dashboard')
        //     return;
        //   }
        //   return response
        // } catch {
        //   navigate('/dashboard')
        // }
    })
  };
  return (
    <ThemeProvider theme={theme}>
      <GjsEditor
        className="gjs-custom-editor text-white bg-slate-900"
        grapesjs={grapesjs}
        grapesjsCss="https://unpkg.com/grapesjs/dist/css/grapes.min.css"
        options={gjsOptions}
        plugins={[gjsBlocksBasic, gjsPluginForms, gjsComponentCountdown, gjsPluginExport, gjsTabs, gjsCustomCode, gjsTouch, gjsParserPostcss, gjsTooltip, gjsTuiImageEditor, gjsTyped, gjsStyleBg, gjsScriptEditor]}
        onEditor={onEditor}
      >
        <div className={`flex h-full border-t ${MAIN_BORDER_COLOR}`}>
          <div className="gjs-column-m flex flex-col flex-grow">
            <Topbar className="min-h-[48px]" />
            <Canvas className="flex-grow gjs-custom-editor-canvas" />
          </div>
          <RightSidebar
            className={`gjs-column-r w-[300px] border-l ${MAIN_BORDER_COLOR}`}
          />
        </div>
        <ModalProvider>
          {({ open, title, content, close }) => (
            <CustomModal
              open={open}
              title={title}
              children={content}
              close={close}
            />
          )}
        </ModalProvider>
        <AssetsProvider>
          {({ assets, select, close, Container }) => (
            <Container>
              <CustomAssetManager
                assets={assets}
                select={select}
                close={close}
              />
            </Container>
          )}
        </AssetsProvider>
      </GjsEditor>
    </ThemeProvider>
  )
}

export default CustomEditor