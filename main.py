import requests
from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
from flask import Flask, request
from flask_restful import Resource, Api
from flask_restful import reqparse
import SocketServer
app = Flask(__name__)
api = Api(app)

class Polling:
    def getToken(self):
        data = [
            ('grant_type', 'password'),
            ('username', 'candidate1'),
            ('password', 'VWs99M3mgXtPMRQe'),
        ]

        response = requests.post('https://admin.galois.capital/mfa/oauth2/token/', data=data, auth=('A5PPXeV8GyYDnjlvMvgnyl1c6HxSetADpgNX2zFj', 'OUa0kftm8rvi6YfGrHfnnkXBUaQUugUZhtH5qfhATpztgu3Vqz48OLpOBc81wwsWQmSu2j1OuxczaI4BouMsI7YZjgTdLMjgoIEoSrZpNEc98DkgTwmXwWp7VXhMiWfz'))
        response = response.json()
        access_token = response['access_token']
        return access_token

    def getSymbol(self, access_token):
        headers = {
            'Authorization': 'Bearer {}'.format(access_token),
        }
        data = [
            ('action', 'fetch_symbols'),
        ]

        response = requests.post('https://admin.galois.capital/desk_exchange_accounts/krakenEA/ccxt/', headers=headers, data=data)
        response = response.json()
        symbol = response;
        return symbol

    def getData(self, access_token, symbol):
        headers = {
            'Authorization': 'Bearer {}'.format(access_token),
        }

        data = [
          ('account_type', 'desk'),
          ('symbol', '{}'.format(symbol)),
          ('exchange_list', '[krakenEA, binanceEA, bittrexEA, kucoinEA]'),
        ]

        response = requests.post('https://admin.galois.capital/companies/CC1/get_aggregated_book/', headers=headers, data=data)
        response = response.json()
        return response

startpolling = Polling()

class S(Resource):

    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('params')
        args = parser.parse_args()
        print args
        if(args['params'] != None) :
            access_token = startpolling.getToken()
            resp = startpolling.getData(access_token, args['params'])
            return resp
        else :
            access_token = startpolling.getToken()
            symbols = startpolling.getSymbol(access_token)
            return symbols

api.add_resource(S,'/server')

if __name__ == '__main__':
     app.run(port='5002')
