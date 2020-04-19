/**
 * Cancel Alarm
 * @id {string} int for android
 * @oid {string} needed for iOS
 * @notification {object}
 * @userInfo {object}
 */
import PropTypes from "prop-types";
import PushNotification from "react-native-push-notification";
import { Platform } from "react-native";
import PushNotificationIOS from "@react-native-community/push-notification-ios";

// local
import { getAlarmById } from "./getAlarms";
import { editAlarm } from "./editAlarm";

export const cancelAlarm = (alarm) => {
  if (!alarm) {
    throw new Error("Please enter an alarm");
  }
  const { id } = alarm;

  if (Platform.OS === "ios") {
    // this logic is needed because of how ios alarms are set
    PushNotificationIOS.getScheduledLocalNotifications((notification) => {
      notification.forEach(({ userInfo }) => {
        if (userInfo.id === id || userInfo.oid === id) {
          PushNotification.cancelLocalNotifications({ id: userInfo.id });
        }
      });
    });
  } else {
    PushNotification.cancelLocalNotifications({ id: JSON.stringify(id) });
  }
};

cancelAlarm.propTypes = {
  alarm: PropTypes.object.isRequired,
};

export const cancelAlarmById = async (id) => {
  if (!id) {
    throw new Error("Please enter an alarm id");
  }

  const alarm = await getAlarmById(id);
   if (!alarm) {
     throw new Error("There is not an alarm with this id");
   }

  await editAlarm(Object.assign({}, alarm, { active: false }));

  if (Platform.OS === "ios") {
    // this logic is needed because of how ios alarms are set
    PushNotificationIOS.getScheduledLocalNotifications((notification) => {
      notification.forEach(({ userInfo }) => {
        if (userInfo.id === id || userInfo.oid === id || userInfo.oid === alarm.oid) {
          PushNotification.cancelLocalNotifications({ id: userInfo.id });
        }
      });
    });
  } else {
    PushNotification.cancelLocalNotifications({ id: JSON.stringify(id) });
  }
};

cancelAlarmById.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

// doesn't call edit alarm
export const cancelAlarmByIdFromDelete = async (id) => {
  if (!id) {
    throw new Error("Please enter an alarm id");
  }

  if (Platform.OS === "ios") {
    // this logic is needed because of how ios alarms are set
    PushNotificationIOS.getScheduledLocalNotifications((notification) => {
      notification.forEach(({ userInfo }) => {
        if (userInfo.id === id || userInfo.oid === id) {
          PushNotification.cancelLocalNotifications({ id: userInfo.id });
        }
      });
    });
  } else {
    PushNotification.cancelLocalNotifications({ id: JSON.stringify(id) });
  }
};

cancelAlarmByIdFromDelete.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
