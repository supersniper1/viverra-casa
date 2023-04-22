import datetime
import functools
import os
import time

import requests
import tweepy
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

TWEEPY_TOKEN = str(os.getenv('TWEEPY_TOKEN'))
options = webdriver.ChromeOptions()
options.add_argument('--headless')
driver = webdriver.Chrome(options=options)


def time_test(func):
    @functools.wraps(func)
    def timeit_wrapper(*args, **kwargs):
        start_time = time.perf_counter()
        result = func(*args, **kwargs)
        end_time = time.perf_counter()
        total_time = end_time - start_time
        print(f'Function {func.__name__}{args} {kwargs} Took {total_time:.4f} seconds')
        return result
    return timeit_wrapper


@time_test
def get_tweets_from_username(username):
    url = f"https://twitter.com/{username}"
    driver.get(url)
    tweets = []
    result = False

    # Get scroll height after first time page load
    last_height = driver.execute_script("return document.body.scrollHeight")

    last_elem = ''
    current_elem = ''
    counter = 0
    number = 2

    while True or counter == number:
        # Scroll down to bottom
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        # Wait to load page
        time.sleep(1)
        # Calculate new scroll height and compare with last scroll height
        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == last_height:
            break
        last_height = new_height

        # update all_tweets to keep loop
        all_tweets = driver.find_elements(By.XPATH, '//div[@data-testid]//article[@data-testid="tweet"]')

        for item in all_tweets[1:]:  # skip tweet already scrapped

            try:
                date = item.find_element(By.XPATH, './/time').text
            except:
                date = '[empty]'

            try:
                text = item.find_element(By.XPATH, './/div[@data-testid="tweetText"]').text
            except:
                text = '[empty]'

            try:
                replying_to = item.find_element(By.XPATH, './/div[contains(text(), "Replying to")]//a').text
            except:
                replying_to = '[empty]'

            # Append new tweets replies to tweet array
            tweets.append([username, replying_to, text, date])

            if (last_elem == current_elem):
                result = True
            else:
                last_elem = current_elem
        if counter >= number:
            break
        counter += 1
    return tweets







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