# man = 'longest man'
# p 6
# p '6'
# p true
# p false
# puts 'baba o', 566
# print 'hello'+' world', 6767, man.length
# p 34,'2663',true
# p true==!!(2 && 4)
# p 2 && !!4
# p 4+5*2-1
# p 4+1&&7
# p 7==1&&7
# p 7&&1!=1
# p 7*1%3
# p 7%1*3
# num=6
# num+=9
# puts ++num

# bracket
# mult,div,%
# add,sub
# comparison
# boolean

p 2&&3==2

def hi name, age
  p 'My name is '+name
  p "\n\n"
  print 'I am ' ,age," years old\n"
  # return [name,age]
end

# def hi
#   p 'just hi'
# end

res=hi 'fattylee', 29
p res

def goodbye(name)
return "Bye "+name+"."
end

puts goodbye("Daniel")   # => "Bye Daniel."
puts goodbye("Mark")     # => "Bye Mark."
puts goodbye("Beyonce")  # => "Bye Beyonce."

p 'shbdh'

num=0
if num>0
  puts 'positive'
elsif num<0
  puts 'negative'
else
  puts 'zero'
end

puts 'Enter your name'
name="default"||gets.chomp
puts "Your name is #{name}"
num='3'.to_f
p 1+num**2+6,'sd'

x=11
case x
when 1,2,3
  puts 'less than 4'
when 4,5 
  puts '4 or 5'
else
  puts 'invalid input'
end

is_making_money=0
puts 'love coding' if is_making_money
puts 'enjoys learning' unless is_making_money

x=0
while x<10
  puts "x value is #{x}"
  x+=1
end
p x

x=0
puts 'until loop start'
until x>10
  puts x
  x+=1
end
puts "outside until loop: #{x}"























