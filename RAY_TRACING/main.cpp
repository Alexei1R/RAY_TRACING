#include <iostream>
#include <SFML/Graphics.hpp>


int main()
{
	int w = 1080;
	int h = 720;
	int mouseX = w / 2;
	int mouseY = h / 2;
	float mouseSensitivity = 1.0f;
	float speed = 0.1f;
	bool mouseHidden = true;
	bool wasdUD[6] = { false, false, false, false, false, false };
	sf::Vector3f pos = sf::Vector3f(-5.0f, 0.0f, 0.0f);
	auto clock = sf::Clock{};



	sf::RenderWindow window(sf::VideoMode(w, h), "Ray tracing", sf::Style::Titlebar | sf::Style::Close);
	window.setFramerateLimit(6);

	

	sf::RenderTexture texture;
	texture.create(w, h);
	sf::Sprite textureSprite = sf::Sprite(texture.getTexture());



	sf::Shader shader;
	shader.loadFromFile("C:/Users/alexe/OneDrive/Desktop/RAY_TRACING/shader.frag", sf::Shader::Fragment);
	shader.setUniform("u_resolution", sf::Vector2f(w, h));


	

	auto mouse_position = sf::Vector2f{};


	float lastx = w/2;
	float lasty = h/2;
	float dx;
	float dy;

	float x;
	float y;




	while (window.isOpen())
	{
		for (auto event = sf::Event{}; window.pollEvent(event);)
		{
			if (event.type == sf::Event::Closed)
			{
				window.close();
			}
			else if (event.type == sf::Event::MouseMoved)
			{
				mouse_position = window.mapPixelToCoords({ event.mouseMove.x, event.mouseMove.y });
			}
		}
		x = mouse_position.x;
		y = mouse_position.y;


		dx = (x - lastx)*mouseSensitivity;
		dy = (y - lasty)* mouseSensitivity;
		
		lastx = x;
		lasty = y;
		
		std::cout << dx << " : " << dy << "\n";



		shader.setUniform("u_resolution", sf::Glsl::Vec2{ window.getSize() });
		shader.setUniform("u_mouse", sf::Glsl::Vec2{ dx,dy });
		shader.setUniform("u_time", clock.getElapsedTime().asSeconds());

		window.clear();
		texture.draw(textureSprite, &shader);
		window.draw(textureSprite);
		window.display();
	}
};
