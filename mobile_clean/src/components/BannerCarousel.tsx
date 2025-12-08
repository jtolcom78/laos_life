import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity, StyleSheet, FlatList, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

interface Banner {
    id: number;
    title?: string;
    images?: { [key: string]: string };
    imageUrl: string;
    linkUrl?: string;
}

interface BannerCarouselProps {
    data: Banner[];
    onPress?: (banner: Banner) => void;
}

export const BannerCarousel: React.FC<BannerCarouselProps> = ({ data, onPress }) => {
    const { i18n } = useTranslation();
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    // Default banner if no data
    const displayData = data.length > 0 ? data : [
        { id: 0, title: 'Welcome', imageUrl: 'https://via.placeholder.com/800x400/006400/ffffff?text=Premium+Marketplace' }
    ];

    // Auto-scroll logic
    useEffect(() => {
        if (displayData.length <= 1) return;

        const interval = setInterval(() => {
            let nextIndex = activeIndex + 1;
            if (nextIndex >= displayData.length) {
                nextIndex = 0;
            }
            flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
            setActiveIndex(nextIndex);
        }, 3000);

        return () => clearInterval(interval);
    }, [activeIndex, displayData.length]);

    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const slideSize = event.nativeEvent.layoutMeasurement.width;
        const index = event.nativeEvent.contentOffset.x / slideSize;
        const roundIndex = Math.round(index);

        // Only verify if index changed substantially to avoid jitter
        if (roundIndex !== activeIndex) {
            setActiveIndex(roundIndex);
        }
    };

    const getItemLayout = (data: any, index: number) => ({
        length: width,
        offset: width * index,
        index,
    });

    const getBannerImage = (item: Banner) => {
        if (!item.images) return item.imageUrl;

        const lang = i18n.language || 'lo';
        // Priority: User Lang -> Lao -> English -> Chinese -> Korean
        return item.images[lang] ||
            item.images['lo'] ||
            item.images['en'] ||
            item.images['zh'] ||
            item.images['ko'] ||
            Object.values(item.images)[0] ||
            item.imageUrl;
    };

    const renderItem = ({ item }: { item: Banner }) => (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => onPress && onPress(item)}
            style={{ width: width, height: width * 0.4 }}
        >
            <View style={styles.cardContainer}>
                <Image
                    source={{ uri: getBannerImage(item) }}
                    style={styles.image}
                    resizeMode="cover"
                />
                {item.title && (
                    <View style={styles.overlay}>
                        <Text style={styles.title} numberOfLines={2}>
                            {item.title}
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <View>
            <FlatList
                ref={flatListRef}
                data={displayData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                getItemLayout={getItemLayout}
                scrollEventThrottle={16} // smooth scrolling updates
            />
            {/* Pagination Dots */}
            {displayData.length > 1 && (
                <View style={styles.paginationContainer}>
                    {displayData.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                { backgroundColor: index === activeIndex ? '#00963c' : 'rgba(255, 255, 255, 0.5)' }
                            ]}
                        />
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        flex: 1,
        borderRadius: 24,
        overflow: 'hidden',
        marginHorizontal: 16,
        marginVertical: 8,
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
        // Height needs adjustment for the margin
        height: (width * 0.4) - 16,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        paddingBottom: 20,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    title: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    paginationContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 24,
        alignSelf: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)'
    }
});
