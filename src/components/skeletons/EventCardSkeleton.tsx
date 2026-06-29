import SkeletonContent from "react-native-skeleton-content";

import { View } from "react-native";
export default function EventCardSkeleton() {
  return (
    <View style={{ marginTop: 16, marginBottom: 20 }}>
      <SkeletonContent isLoading={true} layout={[
        {
            key: 'image',
            width: 250,
            height: 200,
            borderRadius: 16,
        },
        {
            key: 'title',
            width: 180,
            height: 20,
            marginTop: 12,
        },{
            key: 'location',
            width: 120,
            height: 15,
            marginTop: 8,
        }
      ]}></SkeletonContent>
    </View>
  );
}
