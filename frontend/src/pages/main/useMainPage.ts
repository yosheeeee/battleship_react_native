import * as ImagePicker from 'expo-image-picker';
import { useContext, useEffect, useState } from 'react';
import { authContext } from '~/store/auth';
import api from 'api';
import { Alert } from 'react-native';

export interface IUserMainInfo {
  nickname: string;
  avatarUrl?: string;
  winGamesCount: number;
  loseGamesCount: number;
  hasCurrentGame: boolean;
  currentGameId?: number;
}

export default function useMainPage() {
  const { logout, getToken } = useContext(authContext);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<IUserMainInfo | null>(null);
  const [image, setImage] = useState<string | null>(null);

  //fetching data from backend
  useEffect(() => {
    setLoading(true);
    getToken()
      .then((token) => {
        api
          .get<IUserMainInfo>('/main-info', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => res.data)
          .then((data) => {
            setUserInfo(data);
          });
      })
      .finally(() => setLoading(false));
  }, []);

  // Функция для выбора изображения
  const pickImage = async () => {
    // Запрашиваем разрешение на доступ к медиа
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Ошибка', 'Необходимо разрешение для доступа к фото.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      setImage(selectedImage.uri);
      uploadImage(selectedImage);
    }
  };

  // Функция для загрузки изображения на сервер
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', {
      uri: file.uri,
      type: file.mimeType || 'image/jpeg',
      name: file.fileName || 'photo.jpg',
    });

    getToken().then((token) => {
      api
        .postForm('/main-info/upload-avatar', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => res.data)
        .then((data) => console.log(data))
        .catch((e) => {
          console.error(e);
          console.dir(e);
          console.log(e.data);
        });
    });
  };

  return {
    logout,
    userInfo,
    loading,
    pickImage,
    image,
  };
}
