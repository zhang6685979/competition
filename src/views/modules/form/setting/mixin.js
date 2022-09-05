import Vue from 'vue';
export default {
    data() {
        return {
            formKey: null
        }
    },
    computed: {
        getUploadHeader() {
            return {
                token: Vue.cookie.get('token')
            }
        },
        getUploadUrl() {
            return `${process.env.VUE_APP_API_ROOT}/user/file/upload`
        },
        getUserInfo() {
            return JSON.parse(this.$store.getters['user/userInfo'])
        }
    },
    created() {
        this.formKey = this.$route.query.key
    },
    mounted() {},
    methods: {}
}
