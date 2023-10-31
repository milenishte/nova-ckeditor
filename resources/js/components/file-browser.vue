<template>
    <modal v-model="isVisible" ref="modal" class="file-modal" :title="__('Files')" content-no-overflow>
        <div class="relative flex min-h-full bg-white max-h-full overflow-y-scroll">
            <iframe src="/laravel-filemanager" width="100%" :height="iframeHeight" frameborder="0"></iframe>
        </div>

        <template v-slot:footer>
            <div class="flex p-2">
                <div>
                    <button :disabled="!selected" @click.prevent="insert(selected)" class="bg h-9 shadow bg-primary-500 hover:bg-primary-400 mr-3 text-white dark:text-gray-900 rounded inline-flex items-center justify-center px-3 shadow">
                        <span>{{ __('Insert File') }}</span>
                    </button>
                </div>
            </div>
        </template>
    </modal>
</template>

<script>
import modal from './modal'

export default {
    name: "file-browser",
    components: {modal},
    props: {
        fieldKey: {default: () => 'content'},
    },
    data: () => ({
        isVisible: false,
        selected: null,
    }),
    computed: {
        iframeHeight() {
            return (window.innerHeight || document.documentElement.clientHeight) * 0.9;
        },
        event() {
            return `ckeditor:file-manager:${this.fieldKey}`
        }
    },
    methods: {
        insert(file) {
            Nova.$emit(`${this.event}:write`, file)
            this.isVisible = false
        },

        /**
         * Show the Modal
         */
        show() {
            this.selected = null
            this.isVisible = !this.isVisible
        },

        /**
         * Close the Modal
         * If the user focuses another instance of the editor, close the modal.
         */
        close(fieldKey) {
            if (fieldKey !== this.fieldKey) {
                this.isVisible = false
            }
        },
    },
    created() {
        Nova.$on(this.event, this.show)
        Nova.$on(`ckeditor:focused`, this.close)
    },
    beforeDestroy() {
        Nova.$off(this.event, this.show)
        Nova.$off(`ckeditor:focused`, this.close)
    }
}
</script>

<style lang="sass">
</style>
