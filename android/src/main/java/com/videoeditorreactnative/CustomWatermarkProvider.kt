package com.videoeditorreactnative

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.content.res.AssetFileDescriptor
import android.content.res.AssetManager
import android.util.Log
import android.net.Uri
import com.banuba.sdk.ve.effects.watermark.WatermarkProvider
import com.banuba.sdk.utils.ContextProvider.getAssets
import java.io.FileNotFoundException

class CustomWatermarkProvider(private val context: Context, private val imagePath: String) : WatermarkProvider {

    override fun getWatermarkBitmap(): Bitmap? {
        return try {
            val inputStream = context.assets.open(imagePath)
            val watermark = BitmapFactory.decodeStream(inputStream)
            inputStream.close()
            watermark
        } catch (e: FileNotFoundException) {
            Log.w(TAG, "File not found: $imagePath", e)
            null
        } 
    }
}