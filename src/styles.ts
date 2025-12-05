import { dedent } from 'ts-dedent';

export default function () {
  return dedent /* css */ `
    .docs-story-html {
        font-size: 14px;
        position: relative;
    }

    .docs-story-html__src {
        padding: 20px;
        margin: 0;
        /* min-height: 200px; */
        max-height: 40vh;
        overflow: auto;
        font-family:
            ui-monospace, Menlo, Monaco, "Roboto Mono", "Oxygen Mono",
            "Ubuntu Monospace", "Source Code Pro", "Droid Sans Mono", "Courier New",
            monospace;
    }

    /*=============================================
    =            Scrollbar            =
    =============================================*/
    .docs-story-html__src::-webkit-scrollbar {
        width: 12px;
    }

    .docs-story-html__src::-webkit-scrollbar:horizontal {
        height: 12px;
    }

    .docs-story-html__src::-webkit-scrollbar-track,
    .docs-story-html__src::-webkit-scrollbar-corner {
        background-color: transparent;
    }

    .docs-story-html__src::-webkit-scrollbar-thumb {
        border-radius: 8px;
        border: 3px solid transparent;
        background-clip: content-box;
        background-color: #837dff;
    }
    /*=====  End of Scrollbar  ======*/

    /*=============================================
    =            Copy Button            =
    =============================================*/
    .docs-story-html__copy-btn {
        position: absolute;
        top: 10px;
        right: 18px;
        padding: 5px 10px;
        font-size: 12px;
        background-color: #837dff;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        opacity: 0.8;
        transition: opacity 0.3s;
    }

    .docs-story-html__copy-btn:hover {
        opacity: 1;
    }
    /*=====  End of Copy Button  ======*/

    /*=============================================
    =            Sidebar Panel            =
    =============================================*/ 
    #storybook-panel-root .docs-story-html {
        position: absolute;
        width: 100%;
        height: 100%;
    }
        
    #storybook-panel-root .docs-story-html__src {
        padding: 15px;
        height: 100%;
        max-height: none;
        min-height: auto;
    }
    /*=====  End of Sidebar Panel  ======*/
`;
}
