-- Insert default user for testing
INSERT INTO users (id, username, email) 
VALUES (1, 'demo_user', 'demo@example.com')
ON CONFLICT (id) DO NOTHING;

-- Insert default locations
INSERT INTO locations (id, user_id, name, type, description) 
VALUES 
  (1, 1, 'Таверна "Золотой дракон"', 'Таверна', 'Уютное место в центре города, где собираются искатели приключений за кружкой эля.'),
  (2, 1, 'Тёмный лес', 'Лес', 'Загадочный лес на окраине королевства. Здесь водятся странные существа и скрыты древние руины.'),
  (3, 1, 'Королевский дворец', 'Город', 'Величественная резиденция короля Альдериха III. Место интриг и политических игр.')
ON CONFLICT (id) DO NOTHING;