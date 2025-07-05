"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configs = exports.unload = exports.load = void 0;
// @ts-ignore
const package_json_1 = __importDefault(require("../package.json"));
const PACKAGE_NAME = package_json_1.default.name;
const load = function () {
    console.debug(`${PACKAGE_NAME} load`);
};
exports.load = load;
const unload = function () {
    console.debug(`${PACKAGE_NAME} unload`);
};
exports.unload = unload;
exports.configs = {
    "android": {
        hooks: "./hooks",
        options: {
            address: {
                label: `i18n:${PACKAGE_NAME}.address`,
                default: 'http://your-cdn.com/',
                render: {
                    ui: 'ui-input',
                    attributes: {
                        placeholder: 'Enter remote address...',
                    }
                },
                verifyRules: ['required'],
            },
            version: {
                label: `i18n:${PACKAGE_NAME}.version`,
                default: '1.0.0',
                render: {
                    ui: 'ui-input',
                    attributes: {
                        placeholder: 'Enter package version...',
                    }
                },
                verifyRules: ['required'],
            }
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NvdXJjZS9idWlsZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLGFBQWE7QUFDYixtRUFBeUM7QUFDekMsTUFBTSxZQUFZLEdBQUcsc0JBQVcsQ0FBQyxJQUFJLENBQUM7QUFFL0IsTUFBTSxJQUFJLEdBQXFCO0lBQ2xDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxZQUFZLE9BQU8sQ0FBQyxDQUFDO0FBQzFDLENBQUMsQ0FBQTtBQUZZLFFBQUEsSUFBSSxRQUVoQjtBQUVNLE1BQU0sTUFBTSxHQUF1QjtJQUN0QyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsWUFBWSxTQUFTLENBQUMsQ0FBQztBQUM1QyxDQUFDLENBQUE7QUFGWSxRQUFBLE1BQU0sVUFFbEI7QUFFWSxRQUFBLE9BQU8sR0FBdUI7SUFDdkMsU0FBUyxFQUFFO1FBQ1AsS0FBSyxFQUFFLFNBQVM7UUFDaEIsT0FBTyxFQUFFO1lBQ0wsT0FBTyxFQUFFO2dCQUNMLEtBQUssRUFBRSxRQUFRLFlBQVksVUFBVTtnQkFDckMsT0FBTyxFQUFFLHNCQUFzQjtnQkFDL0IsTUFBTSxFQUFFO29CQUNKLEVBQUUsRUFBRSxVQUFVO29CQUNkLFVBQVUsRUFBRTt3QkFDUixXQUFXLEVBQUUseUJBQXlCO3FCQUN6QztpQkFDSjtnQkFDRCxXQUFXLEVBQUUsQ0FBQyxVQUFVLENBQUM7YUFDNUI7WUFDRCxPQUFPLEVBQUU7Z0JBQ0wsS0FBSyxFQUFFLFFBQVEsWUFBWSxVQUFVO2dCQUNyQyxPQUFPLEVBQUUsT0FBTztnQkFDaEIsTUFBTSxFQUFFO29CQUNKLEVBQUUsRUFBRSxVQUFVO29CQUNkLFVBQVUsRUFBRTt3QkFDUixXQUFXLEVBQUUsMEJBQTBCO3FCQUMxQztpQkFDSjtnQkFDRCxXQUFXLEVBQUUsQ0FBQyxVQUFVLENBQUM7YUFDNUI7U0FDSjtLQUNKO0NBQ0osQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEJ1aWxkUGx1Z2luIH0gZnJvbSBcIkBjb2Nvcy9jcmVhdG9yLXR5cGVzL2VkaXRvci9wYWNrYWdlcy9idWlsZGVyL0B0eXBlcy9wdWJsaWNcIjtcclxuLy8gQHRzLWlnbm9yZVxyXG5pbXBvcnQgcGFja2FnZUpTT04gZnJvbSBcIi4uL3BhY2thZ2UuanNvblwiXHJcbmNvbnN0IFBBQ0tBR0VfTkFNRSA9IHBhY2thZ2VKU09OLm5hbWU7XHJcblxyXG5leHBvcnQgY29uc3QgbG9hZDogQnVpbGRQbHVnaW4ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgY29uc29sZS5kZWJ1ZyhgJHtQQUNLQUdFX05BTUV9IGxvYWRgKTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHVubG9hZDogQnVpbGRQbHVnaW4uVW5sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zb2xlLmRlYnVnKGAke1BBQ0tBR0VfTkFNRX0gdW5sb2FkYCk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBjb25maWdzOkJ1aWxkUGx1Z2luLkNvbmZpZ3MgPSB7XHJcbiAgICBcImFuZHJvaWRcIjoge1xyXG4gICAgICAgIGhvb2tzOiBcIi4vaG9va3NcIixcclxuICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgIGFkZHJlc3M6IHtcclxuICAgICAgICAgICAgICAgIGxhYmVsOiBgaTE4bjoke1BBQ0tBR0VfTkFNRX0uYWRkcmVzc2AsXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAnaHR0cDovL3lvdXItY2RuLmNvbS8nLFxyXG4gICAgICAgICAgICAgICAgcmVuZGVyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdWk6ICd1aS1pbnB1dCcsXHJcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcjogJ0VudGVyIHJlbW90ZSBhZGRyZXNzLi4uJyxcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgdmVyaWZ5UnVsZXM6IFsncmVxdWlyZWQnXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdmVyc2lvbjoge1xyXG4gICAgICAgICAgICAgICAgbGFiZWw6IGBpMThuOiR7UEFDS0FHRV9OQU1FfS52ZXJzaW9uYCxcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6ICcxLjAuMCcsXHJcbiAgICAgICAgICAgICAgICByZW5kZXI6IHtcclxuICAgICAgICAgICAgICAgICAgICB1aTogJ3VpLWlucHV0JyxcclxuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiAnRW50ZXIgcGFja2FnZSB2ZXJzaW9uLi4uJyxcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgdmVyaWZ5UnVsZXM6IFsncmVxdWlyZWQnXSxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSJdfQ==