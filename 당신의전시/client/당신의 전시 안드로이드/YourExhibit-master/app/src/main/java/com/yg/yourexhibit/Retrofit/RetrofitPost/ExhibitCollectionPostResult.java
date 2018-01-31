package com.yg.yourexhibit.Retrofit.RetrofitPost;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Created by 2yg on 2017. 10. 18..
 */

@Data
@AllArgsConstructor
public class ExhibitCollectionPostResult {
    int collection_idx;
    int user_idx;
    int exhibition_idx;
    String exhibition_name;
    String collection_content;
    String collection_image;
}
