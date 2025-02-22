import React, { useContext, useRef, useState } from 'react';
import { Text, View, TouchableOpacity, Image, FlatList, Dimensions } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { style } from './styles';
import { AuthContextList } from '../../context/authContext_list';
import Logo from '../../assets/logo.png';
import Flag from '../../Flag/index';
import { ScrollView, Swipeable } from 'react-native-gesture-handler';

export default function Pesquisar() {
  const { onOpen, newBook, excluir, handleEdit } = useContext<AuthContextType>(AuthContextList);
  const swipeableRefs = useRef([]);
  const [expandedItems, setExpandedItems] = useState<number[]>([]); // Estado para controlar os itens expandidos

  const {width} = Dimensions.get('window');

  const images = [
    {
      id: 1,
      image: require("../../assets/tela1.png")
    },
    {
      id: 2,
      image: require("../../assets/tela2.png")
    },
    {
      id: 3,
      image: require("../../assets/tela3.png")
    },
    {
      id: 4,
      image: require("../../assets/tela4.png")
    },
    {
      id: 5,
      image: require("../../assets/tela5.png")
    },
  ]
  const [activeIndex, setActiveIndex] = useState(0)
  

  const OnBoardingItem = ({ item }) => {
    if (!item || !item.image) return null;
    return <Image source={item.image} style={style.image} />;
  };

  const formatarData = (data: string) => {
    // Aqui você pode fazer o corte, por exemplo, pegando os 10 primeiros caracteres
    return data.substring(0, 10); // Exemplo: "2025-01-24"
  };

  const toggleExpand = (index: number) => {
    setExpandedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const renderRightActions = () => (
    <View style={style.button}>
      <AntDesign name="delete" size={20} color={"#FFF"} />
    </View>
  );

  const renderLeftActions = () => (
    <View style={[style.button, { backgroundColor: '#42C3FF' }]}>
      <AntDesign name="edit" size={20} color={"#FFF"} />
    </View>
  );

  const handleSwipeOpen = (directions, item, index) => {
    if (directions === 'right') {
      excluir(item.id);
    } else if (directions === 'left') {
      handleEdit(item.id);
    }
  };

  const _renderCard = (item, index) => {
    const isExpanded = expandedItems.includes(index); // Verifica se o item está expandido
    const cores =
      item.flag === 'quero ler' ? '#3DBBF6' :
      item.flag === 'lendo' ? '#FFD83A' :
      item.flag === 'lido' ? '#63C263' :
      item.flag === 'esquecido' ? '#000000' : 'blue';

    return (
      <Swipeable
        ref={(ref) => (swipeableRefs.current[index] = ref)}
        key={index}
        renderRightActions={renderRightActions}
        renderLeftActions={renderLeftActions}
        onSwipeableOpen={(directions) => handleSwipeOpen(directions, item, index)}
      >
        <TouchableOpacity
          style={[style.card, isExpanded ? style.additionalInfo : null]} // Altera o estilo se expandido
          onPress={() => toggleExpand(index)}
        >
          <View style={style.rowCard}>
            <View style={style.rowCardLeft}>
              {/* <Image style={style.capa} source={item.capa} /> */}
              <View>
                <Text style={style.titleCard}>{item.title}</Text>
                <Text style={style.descriptionCard}>{item.genero}</Text>
              </View>
            </View>
            <Flag caption={item.flag} color={cores} />
          </View>

          {/* Exibe as informações adicionais se o cartão estiver expandido */}
          {isExpanded && (
            <View style={style.additionalInfo}>
              <Text style={style.infoText}><Text style={{ fontWeight: 'bold' }}>Autor(a):</Text> {item.autor}</Text>
              <Text style={style.infoText}><Text style={{ fontWeight: 'bold' }}>Data de lançamento:</Text> {formatarData(item.lançamento)}</Text>
              <Text style={style.infoText}><Text style={{ fontWeight: 'bold' }}>Quantidade de páginas:</Text> {item.qtdPaginas}</Text>
            </View>
          )}
        </TouchableOpacity>
      </Swipeable>
    );
  };

  return (
    <View style={style.container}>
      <View style={style.header}>
        <Image style={style.mini_logo} source={Logo} />
      </View>

    
      <View style={style.boxList}>
        <ScrollView>  
          <FlatList
            data={images}
            style={{maxHeight:200, marginTop: 20, maxWidth:width}}
            pagingEnabled
            horizontal
            onMomentumScrollEnd={(event)=> {
              setActiveIndex(Math.floor(event.nativeEvent.contentOffset.x/width))
            }}
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => item?.id ? String(item.id) : String(index)}
            renderItem={({item}) => <OnBoardingItem item={item}/>}
          />
          {
            images.length > 1 ? 
            <View style={style.dotsContainer}>
              {
                images.map((_,i)=> (
                  <View
                    key={i}
                    style={[style.dot,{backgroundColor: i == activeIndex ? 'blue' : 'gray'}]}
                  />
                ))
              }
            </View>
            : null
          }
          <Text style={style.text}>Livros registrados</Text>
          <FlatList
          data={newBook} // Exibe os dados
          style={{ marginTop: 20, paddingHorizontal: 30 }}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => _renderCard(item, index)}
        />
        </ScrollView> 
        
        
      </View>
    </View>
  );
}
