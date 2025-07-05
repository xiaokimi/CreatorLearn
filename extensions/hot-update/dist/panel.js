'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$ = exports.template = exports.style = void 0;
exports.update = update;
exports.ready = ready;
exports.close = close;
// @ts-ignore
const package_json_1 = __importDefault(require("../package.json"));
const PACKAGE_NAME = package_json_1.default.name;
exports.style = ``;
exports.template = `
<div class="build-plugin">
    <ui-prop>
        <ui-label slot="label">i18n:${PACKAGE_NAME}.address</ui-label>
        <ui-input slot="content" placeholder="http://your-cdn.com"></ui-input>
    </ui-prop>
    <ui-prop>
        <ui-label slot="label">i18n:${PACKAGE_NAME}.version</ui-label>
        <ui-input slot="content" placeholder="1.0.0"></ui-input>
    </ui-prop>
</div>
`;
exports.$ = {
    root: '.build-plugin'
};
async function update(options, key) {
    if (key) {
        return;
    }
}
function ready(options) {
}
function close() {
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFuZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zb3VyY2UvcGFuZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOzs7Ozs7QUFvQ2Isd0JBSUM7QUFFRCxzQkFFQztBQUVELHNCQUVDO0FBN0NELGFBQWE7QUFDYixtRUFBeUM7QUFDekMsTUFBTSxZQUFZLEdBQUcsc0JBQVcsQ0FBQyxJQUFJLENBQUM7QUFZekIsUUFBQSxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBRVgsUUFBQSxRQUFRLEdBQUc7OztzQ0FHYyxZQUFZOzs7O3NDQUlaLFlBQVk7Ozs7Q0FJakQsQ0FBQztBQUVXLFFBQUEsQ0FBQyxHQUFHO0lBQ2IsSUFBSSxFQUFFLGVBQWU7Q0FDeEIsQ0FBQztBQUVLLEtBQUssVUFBVSxNQUFNLENBQUMsT0FBcUIsRUFBRSxHQUFXO0lBQzNELElBQUksR0FBRyxFQUFFLENBQUM7UUFDTixPQUFPO0lBQ1gsQ0FBQztBQUNMLENBQUM7QUFFRCxTQUFnQixLQUFLLENBQUMsT0FBcUI7QUFFM0MsQ0FBQztBQUVELFNBQWdCLEtBQUs7QUFFckIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCB7IElCdWlsZFRhc2tPcHRpb24gfSBmcm9tIFwiQGNvY29zL2NyZWF0b3ItdHlwZXMvZWRpdG9yL3BhY2thZ2VzL2J1aWxkZXIvQHR5cGVzL3Byb3RlY3RlZFwiO1xyXG4vLyBAdHMtaWdub3JlXHJcbmltcG9ydCBwYWNrYWdlSlNPTiBmcm9tIFwiLi4vcGFja2FnZS5qc29uXCJcclxuY29uc3QgUEFDS0FHRV9OQU1FID0gcGFja2FnZUpTT04ubmFtZTtcclxuXHJcbmludGVyZmFjZSBJT3B0aW9ucyB7XHJcbiAgICByZW1vdGVBZGRyZXNzOiBzdHJpbmc7XHJcbn1cclxuXHJcbmludGVyZmFjZSBJVGFza09wdGlvbnMgZXh0ZW5kcyBJQnVpbGRUYXNrT3B0aW9uIHtcclxuICAgIHBhY2thZ2VzOiB7XHJcbiAgICAgICAgW3BhY2thZ2VKU09OLm5hbWVdOiBJT3B0aW9ucztcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHN0eWxlID0gYGA7XHJcblxyXG5leHBvcnQgY29uc3QgdGVtcGxhdGUgPSBgXHJcbjxkaXYgY2xhc3M9XCJidWlsZC1wbHVnaW5cIj5cclxuICAgIDx1aS1wcm9wPlxyXG4gICAgICAgIDx1aS1sYWJlbCBzbG90PVwibGFiZWxcIj5pMThuOiR7UEFDS0FHRV9OQU1FfS5hZGRyZXNzPC91aS1sYWJlbD5cclxuICAgICAgICA8dWktaW5wdXQgc2xvdD1cImNvbnRlbnRcIiBwbGFjZWhvbGRlcj1cImh0dHA6Ly95b3VyLWNkbi5jb21cIj48L3VpLWlucHV0PlxyXG4gICAgPC91aS1wcm9wPlxyXG4gICAgPHVpLXByb3A+XHJcbiAgICAgICAgPHVpLWxhYmVsIHNsb3Q9XCJsYWJlbFwiPmkxOG46JHtQQUNLQUdFX05BTUV9LnZlcnNpb248L3VpLWxhYmVsPlxyXG4gICAgICAgIDx1aS1pbnB1dCBzbG90PVwiY29udGVudFwiIHBsYWNlaG9sZGVyPVwiMS4wLjBcIj48L3VpLWlucHV0PlxyXG4gICAgPC91aS1wcm9wPlxyXG48L2Rpdj5cclxuYDtcclxuXHJcbmV4cG9ydCBjb25zdCAkID0ge1xyXG4gICAgcm9vdDogJy5idWlsZC1wbHVnaW4nXHJcbn07XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlKG9wdGlvbnM6IElUYXNrT3B0aW9ucywga2V5OiBzdHJpbmcpIHtcclxuICAgIGlmIChrZXkpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZWFkeShvcHRpb25zOiBJVGFza09wdGlvbnMpIHtcclxuXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjbG9zZSgpIHtcclxuXHJcbn0iXX0=