import Reactotron from "reactotron-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const reactotron = Reactotron.setAsyncStorageHandler(AsyncStorage)
  .configure({
    name: "Aura Fashion App",
    host: "192.168.1.18",
  })
  .useReactNative({
    asyncStorage: false, // there are more options to the async storage.
    networking: {
      // optionally, you can turn it off with false.
      ignoreUrls: /symbolicate/,
    },
    editor: false, // there are more options to editor
    errors: { veto: (stackFrame) => false }, // or turn it off with false
    overlay: false, // just turning off overlay
  })
  .connect();

export default reactotron;
