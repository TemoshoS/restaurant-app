import * as Notifications from 'expo-notifications';

//Notifaction function
Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
  
  
  //Sms function
  // export const sendSMS = async (message) => {
  //   console.log('Sending SMS');
  //   const apiUrl = 'https://e1dypr.api.infobip.com/sms/2/text/advanced';
  //   const authorizationToken = 'App ece5a5a8f136c21a74bf2657d89ef5dc-85888b0f-5329-4d8f-9c63-762c92741934';
  
  //   const postData = {
  //     messages: [
  //       {
  //         destinations: [
  //           {
  //             to: '27721371977',
  //           },
  //           {
  //             to: '27670962825',
  //           },
  //           {
  //             to: '27730693340',
  //           },
  //         ],
  //         from: 'InfoSMS',
  //         text: message,
  //       },
  //     ],
  //   };
  
  //   try {
  //     const response = await fetch(apiUrl, {
  //       method: 'POST',
  //       headers: {
  //         Authorization: authorizationToken,
  //         'Content-Type': 'application/json',
  //         Accept: 'application/json',
  //       },
  //       body: JSON.stringify(postData),
  //     });
  
  //     const responseData = await response.json();
  //     console.log('HTTP status code:', response.status);
  //     console.log(responseData);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  
  //Notifaction function
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
  
  
  export const NotificationService = () => {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
  
    useEffect(() => {
      registerForPushNotificationsAsync().then((token) => setExpoPushToken(token));
  
      notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });
  
      responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });
  
      return () => {
        Notifications.removeNotificationSubscription(notificationListener.current);
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    }, []);
  
    async function registerForPushNotificationsAsync() {
      let token;
      if (Constants.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          alert('Failed to get push token for push notification!');
          return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
      } else {
        alert('Must use physical device for Push Notifications');
      }
  
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
  
      return token;
    }
  };