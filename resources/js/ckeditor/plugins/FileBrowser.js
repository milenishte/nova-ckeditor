import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'

export default class FileBrowser {
    constructor(editor) {
        this.editor = editor;
        this.config = editor.config;
        this.model = editor.model;
        this.data = editor.data;
        this.ui = editor.ui;

        /*
        window.SetUrl = (items) => {
          console.log(editor);
        };
        */
    }

    beforeDestroy() {
        delete window.SetUrl;
    }

    /**
     * Get Required Children
     * @inheritDoc
     */
    static get requires() {
        return []
    }

    /**
     * Get the Plugin Name
     * @inheritDoc
     */
    static get pluginName() {
        return 'fileBrowser'
    }

    /**
     * Is the plugin enabled?
     * @return {Boolean}
     */
    get isEnabled() {
        return this.config.get('fileBrowser');
    }

    /**
     * Get the Nova field name.
     * @return {String}
     */
    get attribute() {
        return this.config.get('attribute')
    }

    /**
     * Initialize the plugin.
     * Start listening for events.
     * @return void
     */
    init() {
        this.ui.componentFactory.add('fileBrowser', this.createButton.bind(this))
        Nova.$on(`ckeditor:${this.attribute}:file:write`, this.writeContent.bind(this))
    }

    /**
     * Destroy Instance
     * Stop listening for events.
     * @return void
     */
    destroy() {
        Nova.$off(`ckeditor:${this.attribute}:file:write`, this.writeContent.bind(this))
    }

    /**
     * Write Document Content.
     * @param locale object
     * @return {ButtonView}
     */
    createButton(locale) {
        const {t} = locale
        const view = new ButtonView(locale)

        view.set({
            label: t('Insert File'),
            icon: this.icon,
            tooltip: true,
        })

        if (this.isEnabled) {
            view.on('execute', this.openModal.bind(this))
        }

        view.set('isVisible', this.isEnabled)
        return view
    }

    /**
     * Launch the Link Browser.
     */
    openModal() {
        console.log("Opening file manager modal");
        let height = (window.innerHeight || document.documentElement.clientHeight) * 0.9;
        let width = (window.innerWidth || document.documentElement.clientWidth) * 0.9;

        let options = this.config.get('fileBrowserOptions');
        if(options && options.url) {
            window.open(options.url, 'filemanager', 'menubar=no,width=' + width + ',height=' + height);
        } else {
            console.log('File Manager url not defined');
        }
        //Opens the file-browser.vue component
        //Nova.$emit(`ckeditor:file-manager:${this.attribute}`)
    }

    /**
     * Write Document Content.
     * @return void
     */
    writeContent(snippet) {
        console.log(snipplet);
        this.model.insertContent(this.data.toModel(this.data.processor.toView(`<div class="raw-html-embed-no">${snippet}</div>`)));
    }

    /**
     * Get the Icon
     * @return string
     */
    get icon() {
        return `<?xml version="1.0" ?><svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M11.627 16.5zm5.873-.196zm0-7.001V8h-13v8.5h4.341c.191.54.457 1.044.785 1.5H2a1.5 1.5 0 0 1-1.5-1.5v-13A1.5 1.5 0 0 1 2 2h4.5a1.5 1.5 0 0 1 1.06.44L9.122 4H16a1.5 1.5 0 0 1 1.5 1.5v1A1.5 1.5 0 0 1 19 8v2.531a6.027 6.027 0 0 0-1.5-1.228zM16 6.5v-1H8.5l-2-2H2v13h1V8a1.5 1.5 0 0 1 1.5-1.5H16z"></path><path d="M14.5 19.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10zM15 14v-2h-1v2h-2v1h2v2h1v-2h2v-1h-2z"></path> </svg>`
    }
}
