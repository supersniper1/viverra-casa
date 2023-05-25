from selenium import webdriver
from selenium.common import NoSuchElementException
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as ec
from selenium.webdriver.support.wait import WebDriverWait

from .decorators import time_test


options = webdriver.ChromeOptions()
options.add_argument('--headless')
options.add_argument('--disable-dev-shm-usage')
options.add_argument('--no-sandbox')
options.add_argument('--disable-extensions')
options.add_argument('--disable-gpu')
options.add_argument("--lang=en-US")
driver = webdriver.Chrome(options=options)


def scrape_tweet(current_elem, username):
    tweets = []
    try:
        date = current_elem.find_element(By.XPATH, './/time').text
    except NoSuchElementException:
        date = '[empty]'

    try:
        text = current_elem.find_element(By.XPATH, './/div[@data-testid="tweetText"]').text
    except NoSuchElementException:
        text = '[empty]'

    try:
        retweet = current_elem.find_element(By.XPATH, './/div[@data-testid="retweet"]').text
    except NoSuchElementException:
        retweet = '[empty]'
    try:
        like = current_elem.find_element(By.XPATH, './/div[@data-testid="like"]').text
    except NoSuchElementException:
        like = '[empty]'
    try:
        reply = current_elem.find_element(By.XPATH, './/div[@data-testid="reply"]').text
    except NoSuchElementException:
        reply = '[empty]'

    tweets.append({
        'username': username,
        'text': text,
        'date': date,
        'retweet': retweet,
        'like': like,
        'reply': reply
    })

    return tweets


@time_test
def get_tweets_from_username(username):

    # driver = webdriver.Remote(desired_capabilities=DesiredCapabilities().CHROME,
    #                           command_executor="http://chrome:4444/wd/hub", options=options)
    url = f"https://twitter.com/{username}"
    driver.get(url)
    current_element = WebDriverWait(driver, 10).until(
        ec.presence_of_element_located((By.XPATH, '//div[@data-testid]//article[@data-testid="tweet"]'))
    )

    current_elem = scrape_tweet(current_element, username)

    return current_elem
    # print(username)
    # auth = tweepy.Client(
    #     TWEEPY_TOKEN
    # )
    # print(auth)
    # user = auth.get_user(
    #     username=username
    # )
    # print(user)
    # session = auth.get_users_tweets(
    #     user.data.id
    # )
    # tweets = session.data
    # tweets_dict = []
    # for tweet in tweets:
    #     tweets_dict.append(
    #         [
    #             [
    #                 "id",
    #                 tweet.id
    #             ],
    #             [
    #                 "text",
    #                 tweet.text
    #             ]
    #         ]
    #     )
