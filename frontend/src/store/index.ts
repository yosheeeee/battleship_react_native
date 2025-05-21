import Storage from "react-native-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const storage = new Storage({
  size: 100,
  enableCache: true,
  storageBackend: AsyncStorage,
});

export default storage;
