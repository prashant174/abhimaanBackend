





CREATE TABLE polls (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    min_reward INT NOT NULL,
    max_reward INT NOT NULL
);


CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    poll_id INT,
    question_type ENUM('single', 'multiple') NOT NULL,
    question_text VARCHAR(255) NOT NULL,
    FOREIGN KEY (poll_id) REFERENCES polls(id)
);

CREATE TABLE options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT,
    option_text VARCHAR(255) NOT NULL,
    FOREIGN KEY (question_id) REFERENCES questions(id)
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL
);




CREATE TABLE user_votes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    poll_id INT,
    question_id INT,
    option_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (poll_id) REFERENCES polls(id),
    FOREIGN KEY (question_id) REFERENCES questions(id),
    FOREIGN KEY (option_id) REFERENCES options(id)
);

CREATE TABLE poll_analytics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    poll_id INT,
    total_votes INT NOT NULL,
    option_id INT,
    vote_count INT NOT NULL,
    FOREIGN KEY (poll_id) REFERENCES polls(id),
    FOREIGN KEY (option_id) REFERENCES options(id)
);
