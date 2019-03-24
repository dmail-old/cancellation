const { prettiest } = require("@dmail/prettiest")
const {
  namedValueDescriptionToMetaDescription,
  selectAllFileInsideFolder,
} = require("@dmail/project-structure")
const { projectFolder } = require("./projectFolder.js")

const metaDescription = namedValueDescriptionToMetaDescription({
  formattable: {
    "/**/*.js": true,
    "/**/*.json": true,
    "/**/*.md": true,
    "/node_modules/": false, // eslint-disable-line camelcase
    "/dist/": false,
    "/package.json": false,
    "/package-lock.json": false,
  },
})

selectAllFileInsideFolder({
  pathname: projectFolder,
  metaDescription,
  predicate: (meta) => meta.formattable === true,
  transformFile: ({ filenameRelative }) => filenameRelative,
}).then((filenameRelativeArray) => {
  prettiest({ folder: projectFolder, filenameRelativeArray })
})
