Design: Yellow Pages
By: Yaniv Aharon

* searching for people by their _name_, _age_, _phone number_, or any combination thereof.
* empty state: `No results, please review your search or try a different one`
* Each result shown must include the following:

	- Name
	- Age
	- Phone
	- Address
	- Portrait picture (jpg)

* Remarks:
	- Readable code
	- Proper treatment of errors and edge cases
	- A backend
	- Efficiency


[v] Models: PeopleModel
--------------------
 	make the http request

	Functions:
	=========
	1. GetPeopleData()
		make a server call and return its data


[v] View : index.html
------------------
	input - put the text as place holder
	list - ng repeater
	loading animation


[v]  Controller: YellowPagesController
----------------------------------


	Variables:
	==========
	[v] currPeopleResult - collection of the current people to show

	Functions:
	==========
	1. LoadData(inputData)
		1. prefixesArray = GetParsedInput(inputData)
			1. prefix = input.trim()
			2. if (!prefix) return null
			3. return prefix.split(' ')

		1.5 if (!prefixesArray)
			PeopleData = [];

		2. getFilterObject(prefixesArray)
			0. filterObject = {}
			1. each prefix in prefixesArray
				1. currFilterType = GetPrefixType(prefix)
				2. filterObject[currFilterType] = prefix
			2. return filterObject

		3. PeopleModel.GetData() then
			1. result = MapPeople(data)
			2. filter result using filterObject	
			3. update PeopleData

	[v] 2. GetTypeByPrefix(prefix) 
		if prefix is number
			return age
		if prefix is phone number
			return phone
		else
			return name

	[v] 3. MapPeople
		* Translate the data to (Name, Age, Phone, Address, Portrait)
		convert birthday to age
		remove '-' from phone
		replace '400x400' with '40x40' in avatar_origin 
		build address string



	[v] Events:
	======
	OnKeyUp - debounce and call LoadData(prefix)



Assumptions:
-----------
1. also part of phone number is searched
2. case in-sensitive also works
3. client-side infinite scroll
4. same type of search widen search results

known issues:
------------
1. The initial query is very slow (there are frontend solutions for that)
2. On each scroll for the same query, it goes over all persons just to get the next page
3. Implementation of static file serving, instead of using simple npm module which servers static files 
4. The search solution is limited (comparing to search engines solutions), it is not easy to implement a perfect one, but you could have used npm client-side solution for that  


Installation:
-------------
1. copy your 'people.json' file into 'public/data' directory.
2. run the following lines:
	
	```
	npm i
	npm run build-css
	node runServer.js
	```

3. open browser and navigate to:
http://localhost:8069/



