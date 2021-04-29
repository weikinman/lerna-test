import utils from "@vue-fw-lerna/utils";

let components = [];

let plugins = [];

const install = (app, opt) => {
    const option = Object.assign(defaultInstallOpt, opt)
    app.config.globalProperties.$ELEMENT = option

    components.forEach(component => {
        app.component(component.name, component)
    })

    plugins.forEach(plugin => {
        app.use(plugin)
    })
}

export {
    utils,
    install
}

export default {
    install
}