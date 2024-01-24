import { Notification } from "electron";
// import { join } from "path";

// export const appIcon = join(__dirname, "../../assets/appTemplate.png");

function showNotification(message: string, fn?: any) {
  const notification = {
    // title: message,
    body: message,
  };
  const notify: any = new Notification(notification);
  notify.show();
  fn && notify.on("click", fn);
}

export default showNotification;
