import requests
from lxml import html
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import os
import xlrd
import shutil
from prettytable import PrettyTable

def scrape_euipo_search(url, download_dir):
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")

    prefs = {"download.default_directory": download_dir,
             "download.prompt_for_download": False,
             "download.directory_upgrade": True,
             "safebrowsing.enabled": True}
    options.add_experimental_option("prefs", prefs)

    service = Service()
    driver = webdriver.Chrome(service=service, options=options)
    driver.get(url)

    try:
        WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//*[@id=\"cookiePolicyBannerDiv\"]/div/div/div[2]/div[1]"))
        ).click()

        checkbox = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//*[@id=\"selectAll_view14_top\"]"))
        )

        is_checked = checkbox.is_selected()

        if not is_checked:
            driver.execute_script("arguments[0].click();", checkbox)

        WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//*[@id=\"basic-tab-trademarks\"]/div/div/div[1]/div[2]/div[3]/ul/li/a"))
        ).click()

        time.sleep(20)

        downloaded_file = get_latest_file(download_dir)
        if downloaded_file:
            print(f"Downloaded file: {downloaded_file}")
            return process_excel_file(downloaded_file)
        else:
            print("Download failed.")
            return None

        html_source = driver.page_source
        tree = html.fromstring(html_source)

        trademark_data = []
        trademark_boxes = tree.xpath('//*[@id="basic-tab-trademarks"]/div/div/div[3]/div[1]')

        for box in trademark_boxes:
            try:
                trademark = {}
                detail_link = box.xpath('.//a/@href')
                if not detail_link:
                    continue
                detail_url = detail_link[0]
                full_trademark_details = scrape_trademark_details(detail_url, driver)
                trademark.update(full_trademark_details)
                trademark_data.append(trademark)

            except Exception as e:
                print(f"Error processing a trademark box: {e}")
                continue

        return trademark_data

    except Exception as e:
        print(f"An error occurred: {e}")
        return []

    finally:
        driver.quit()


def scrape_trademark_details(detail_url, driver):
    driver.get(detail_url)
    html_source = driver.page_source
    tree = html.fromstring(html_source)
    trademark_details = {}

    trademark_details['Trade mark number'] = extract_text(tree, '//th[contains(text(), "Trade mark number")]/following-sibling::td')
    trademark_details['Type'] = extract_text(tree, '//th[contains(text(), "Type")]/following-sibling::td')
    trademark_details['Filing date'] = extract_text(tree, '//th[contains(text(), "Filing date")]/following-sibling::td')
    trademark_details['Registration date'] = extract_text(tree, '//th[contains(text(), "Registration date")]/following-sibling::td')
    trademark_details['Nice Classification'] = extract_text(tree, '//th[contains(text(), "Nice Classification")]/following-sibling::td')
    trademark_details['Trade mark status'] = extract_text(tree, '//th[contains(text(), "Trade mark status")]/following-sibling::td')
    trademark_details['Basis'] = extract_text(tree, '//th[contains(text(), "Basis")]/following-sibling::td')
    trademark_details['Reference'] = extract_text(tree, '//th[contains(text(), "Reference")]/following-sibling::td')
    trademark_details['Owner ID number'] = extract_text(tree, '//th[contains(text(), "Owner ID number")]/following-sibling::td')
    trademark_details['Owner name'] = extract_text(tree, '//th[contains(text(), "Owner name")]/following-sibling::td')
    trademark_details['Representative ID num'] = extract_text(tree, '//th[contains(text(), "Representative ID num")]/following-sibling::td')
    trademark_details['Representative name'] = extract_text(tree, '//th[contains(text(), "Representative name")]/following-sibling::td')
    trademark_details['Last publication'] = extract_text(tree, '//th[contains(text(), "Last publication")]/following-sibling::td')

    return trademark_details

def extract_text(tree, xpath):
    try:
        elements = tree.xpath(xpath)
        if elements:
            return elements[0].text_content().strip()
        else:
            return None
    except:
        return None

def get_latest_file(dir_path):
    files = [os.path.join(dir_path, f) for f in os.listdir(dir_path) if os.path.isfile(os.path.join(dir_path, f))]
    if not files:
        return None

    latest_file = max(files, key=os.path.getctime)
    return latest_file

def process_excel_file(file_path):
    try:
        workbook = xlrd.open_workbook(file_path)
        sheet = workbook.sheet_by_index(0)

        header = sheet.row_values(1)

        data = []
        for row_index in range(2, sheet.nrows):
            row_values = sheet.row_values(row_index)
            row_data = {}
            for col_index, col_name in enumerate(header):
                if col_index < len(row_values):
                    row_data[col_name] = row_values[col_index]
                else:
                    row_data[col_name] = None

            data.append(row_data)

        return data

    except Exception as e:
        print(f"Error processing Excel file: {e}")
        return None


def print_table(data):
    if not data:
        print("No data to display in a table.")
        return

    table = PrettyTable()

    column_names = data[0].keys()
    table.field_names = column_names

    for row_data in data:
        table.add_row([row_data.get(col, '') for col in column_names])

    print(table)


script_dir = os.path.dirname(os.path.abspath(__file__))
download_directory = script_dir
if not os.path.exists(download_directory):
    os.makedirs(download_directory)

url = "https://euipo.europa.eu/eSearch/#basic/1+1+1+1/100+100+100+100/apple"
excel_data = scrape_euipo_search(url, download_directory)

if excel_data:
    print_table(excel_data)
else:
    print("No trademark data found or an error occurred.")