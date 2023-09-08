#ifdef GL_ES
precision mediump float;
#endif

varying vec2 v_texCoord;
uniform sampler2D u_texture;

void main()
{
    vec4 sum = vec4(0.0);
    float blurRadius = 0.02; // Điều chỉnh bán kính của hiệu ứng mờ ở đây

    // Tính toán trung bình của các giá trị màu xung quanh
    for (float x = -4.0; x <= 4.0; x += 1.0)
    {
        for (float y = -4.0; y <= 4.0; y += 1.0)
        {
            float offsetX = x * blurRadius;
            float offsetY = y * blurRadius;
            sum += texture2D(u_texture, v_texCoord + vec2(offsetX, offsetY));
        }
    }

    gl_FragColor = sum / 81.0; // Số lượng mẫu mờ
}