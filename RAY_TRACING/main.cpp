#include <SFML/Graphics.hpp>

#include <iostream>





int main()
{
    sf::RenderWindow window({800,800},"RAY TRACING");
    window.setFramerateLimit(60);

    auto clock = sf::Clock{};

    sf::RectangleShape shape( sf::Vector2f( window.getSize()));

    sf::Shader shader;
    if (!shader.loadFromFile("C:/Users/alexe/OneDrive/Desktop/RAY_TRACING/shader.frag", sf::Shader::Fragment))
    {
        std::cout << "Couldn't load fragment shader/n";
        return -1;
    }

    sf::Vector2f mouse_position;

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




        shader.setUniform("u_resolution", sf::Glsl::Vec2{ window.getSize() });
        shader.setUniform("u_mouse", sf::Glsl::Vec2{ mouse_position });
        shader.setUniform("u_time", clock.getElapsedTime().asSeconds());

        window.clear();
        window.draw(shape, &shader);
        window.display();
    }
}